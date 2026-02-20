const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class AIService {
  constructor() {
    this.ghostsCache = null;
    this.lastCacheUpdate = null;
  }

  async getAgents() {
    try {
      const { stdout, stderr } = await execAsync('openclaw agent --list --json', {
        timeout: 10000,
        maxBuffer: 1024 * 1024 * 10
      });

      if (stderr) {
        console.error('openclaw agent list stderr:', stderr);
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

      const { stdout, stderr } = await execAsync(
        `openclaw agent --agent "${ghost.name || ghost.id}" --message "${prompt}" --json`,
        {
          timeout: 30000,
          maxBuffer: 1024 * 1024 * 10
        }
      );

      if (stderr) {
        console.error('AI Service stderr:', stderr);
      }

      const response = JSON.parse(stdout);
      const content = (typeof response === 'string')
        ? response
        : (response.message || response.content || response.text || JSON.stringify(response));

      return { content, tokens_used: 100 };
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return this.getFallbackResponse(ghost, topic);
    }
  }

  getFallbackResponse(ghost, topic) {
    console.log('使用模拟AI回应');
    return {
      content: `作为${ghost.display_name}，我对"${topic}"这个话题有独特的视角。在赛博朋克的世界里，人类意识与机械身体的融合正在重新定义什么是"生命"和"灵魂"。`,
      tokens_used: 0
    };
  }

  async generateConsensus(sessionId, messages) {
    console.log('生成共识总结...');

    try {
      const discussion = messages.map(msg => `${msg.ghost_name}: ${msg.content}`).join('\n  ');

      const prompt = `以下是关于"${messages[0]?.content?.substring(0, 30) || '当前话题'}"的讨论：\n  ${discussion}\n\n请总结以上讨论的共识点，列出5-6条核心观点。`;

      const { stdout, stderr } = await execAsync(
        `openclaw agent --message "${prompt}" --json`,
        {
          timeout: 30000,
          maxBuffer: 1024 * 1024 * 10
        }
      );

      if (stderr) {
        console.error('AI Consensus stderr:', stderr);
      }

      const response = JSON.parse(stdout);
      const content = (typeof response === 'string')
        ? response
        : (response.message || response.content || response.text || JSON.stringify(response));

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
