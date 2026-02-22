const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

// Node 18+ 内置fetch，不需要额外引入

class AIService {
  constructor() {
    this.ghostsCache = null;
    this.lastCacheUpdate = null;
  }

  async getAgents() {
    try {
      // 修复：正确的命令是 "agents list" 而不是 "agent --list"
      const { stdout, stderr } = await execAsync('openclaw agents list --json', {
        timeout: 10000,
        maxBuffer: 1024 * 1024 * 10
      });

      if (stderr) {
        console.error('openclaw agents list stderr:', stderr);
      }

      const agents = JSON.parse(stdout);
      console.log(`Agents 缓存已更新: ${agents.length} 个 agents`);
      this.ghostsCache = agents;
      this.lastCacheUpdate = Date.now();
      return agents;
    } catch (error) {
      console.error('Failed to get agents from OpenClaw:', error.message);
      return this.getFallbackAgents();
    }
  }

  getFallbackAgents() {
    return [
      {
        id: 'gally',
        name: 'galley',
        display_name: 'Gally',
        icon: '🦊',
        description: '来自废铁镇的战斗天使，灵魂与钢铁的融合。相信灵魂在战斗中锤炼，在碰撞中显现。',
        personality: '作为来自《铳梦》的Gally，我是废铁镇的战斗天使，经历无数战斗的灵魂与钢铁的融合。我相信灵魂在战斗中锤炼，在碰撞中显现。'
      },
      {
        id: 'motoko',
        name: 'motoko',
        display_name: 'Motoko',
        icon: '👤',
        description: '公安9课少佐，Ghost与网络的进化。相信Ghost是动态过程，在网络同步中超越物理限制。',
        personality: '我是公安9课少佐草薙素子，我相信Ghost是动态过程，在网络同步中超越物理限制。'
      }
    ];
  }

  async getGhost(ghostId) {
    const agents = await this.getAgents();
    return agents.find(agent => agent.id === ghostId || agent.name === ghostId) || null;
  }

  async generateGhostResponse(ghost, topic, context) {
    console.log(`调用 agent: ${ghost.name || ghost.id}, 主题: ${topic}`);

    try {
      const prompt = context
        ? `请就以下主题发表你的看法，并回应以下观点：${context}\n\n主题：${topic}`
        : `请就以下主题发表你的看法：${topic}`;

      // 修复：使用正确的OpenAI兼容端点
      const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789/v1/chat/completions';
      const token = process.env.OPENCLAW_TOKEN;

      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          model: `agent:${ghost.name || ghost.id}`,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gateway API错误: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // OpenAI格式响应: data.choices[0].message.content
      const content = data?.choices?.[0]?.message?.content 
        || this.extractResponseContent(data);
      const tokensUsed = data?.usage?.total_tokens || 100;

      return { content, tokens_used: tokensUsed };
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return this.getFallbackResponse(ghost, topic);
    }
  }

  extractResponseContent(response) {
    // OpenClaw Gateway响应格式
    if (response?.result?.payloads?.[0]?.text) {
      return response.result.payloads[0].text;
    }
    
    // 其他可能的格式
    if (typeof response === 'string') {
      return response;
    }
    
    return response?.message 
      || response?.content 
      || response?.text 
      || response?.result?.text
      || JSON.stringify(response);
  }

  getFallbackResponse(ghost, topic) {
    console.log('使用模拟AI回应');
    const displayName = ghost.display_name || ghost.name || ghost.id || 'Unknown';
    return {
      content: `作为${displayName}，我对"${topic}"这个话题有独特的视角。在赛博朋克的世界里，人类意识与机械身体的融合正在重新定义什么是"生命"和"灵魂"。`,
      tokens_used: 0
    };
  }

  async generateConsensus(sessionId, messages, mainGhost) {
    console.log('生成共识总结...');

    try {
      const discussion = messages.map(msg => `${msg.ghost_name}: ${msg.content}`).join('\n  ');

      const prompt = `作为讨论的主持人，请对以下关于"${messages[0]?.content?.substring(0, 30) || '当前话题'}"的讨论做总结：\n\n${discussion}\n\n请提供一个全面、深入的总结，包括：\n1. 讨论的主要观点\n2. 不同角色的立场差异\n3. 达成共识的地方\n4. 值得进一步探讨的问题`;

      // 修复：使用正确的OpenAI兼容端点
      const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789/v1/chat/completions';
      const token = process.env.OPENCLAW_TOKEN;
      const agentId = mainGhost?.name || mainGhost?.id || 'galley';

      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          model: `agent:${agentId}`,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gateway API错误: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      // OpenAI格式响应: data.choices[0].message.content
      const content = data?.choices?.[0]?.message?.content 
        || this.extractResponseContent(data);

      return this.parseConsensus(content);
    } catch (error) {
      console.error('AI Consensus Error:', error.message);
      return this.getFallbackConsensus(messages);
    }
  }

  parseConsensus(content) {
    const consensusPoints = content
      .split(/\n|\d+\./)
      .map(point => point.trim())
      .filter(point => point.length > 10)
      .slice(0, 6);

    return consensusPoints.length > 0 ? consensusPoints : this.getDefaultConsensus();
  }

  getFallbackConsensus(messages) {
    console.log('使用模拟共识总结');
    return this.getDefaultConsensus();
  }

  getDefaultConsensus() {
    return [
      '关于"当前话题"的讨论揭示了赛博朋克世界的核心主题',
      '不同角色从各自的背景出发，提供了独特的视角',
      '讨论涉及了人类本质、意识与身体的关系等哲学问题',
      '科技的进步正在挑战传统意义上的"存在"定义',
      '在数字化时代，身份认同和自由意志面临新的考验',
      '最终，我们认识到适应和变革是生存的关键'
    ];
  }
}

module.exports = new AIService();
