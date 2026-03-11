const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const aiService = require('./ai-service');
const fs = require('fs').promises;
const path = require('path');

class FlowService {
  async startFlow(topic, ghostIds, userId = null, options = {}) {
    // 修复：支持传入 sessionId 来复用已有会话
    // 如果没有传入 sessionId，则创建新的
    const sessionId = options.sessionId || uuidv4();
    const isNewSession = !options.sessionId;
    const timestamp = new Date().toISOString();
    const maxRounds = options.maxRounds || 6;

    // 如果是新会话，才创建记录
    if (isNewSession) {
      await db.query(
        'INSERT INTO chat_sessions (id, topic, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
        [sessionId, topic, userId, timestamp, timestamp]
      );
    }

    // Get Ghost information
    const ghosts = [];
    for (const ghostId of ghostIds) {
      const ghost = await aiService.getGhost(ghostId);
      if (ghost) {
        ghosts.push(ghost);
      }
    }

    if (ghosts.length === 0) {
      throw new Error('No valid ghosts found');
    }

    // Start discussion flow
    const messages = [];
    let speakerIndex = 0;  // 追踪发言者索引
    let roundNumber = 1;  // 当前轮次
    let discussionContext = '';  // 初始化为空字符串，确保干净

    while (roundNumber <= maxRounds) {
      // 轮询选择发言者
      const currentSpeaker = ghosts[speakerIndex % ghosts.length];
      speakerIndex++;

      // 构建差异化的讨论上下文 - 每轮都有明确的角色指示
      const speakerName = currentSpeaker.display_name || currentSpeaker.name || currentSpeaker.id;
      let roundPrompt;
      
      if (roundNumber === 1 && !discussionContext) {
        // 第一轮：开场发言
        roundPrompt = `你是${speakerName}。请以你独特的视角和风格，就以下主题发表你的开场观点。要求深入、有洞察力，展现你作为${speakerName}的独特思维方式。\n\n主题：${topic}`;
      } else {
        // 后续轮次：回应前面的发言
        const otherSpeakers = ghosts.filter(g => g.id !== currentSpeaker.id);
        const otherNames = otherSpeakers.map(g => g.display_name || g.name || g.id).join('、');
        
        roundPrompt = `你是${speakerName}，这是第${roundNumber}轮讨论。以下是之前的讨论内容：\n\n${discussionContext}\n\n请以${speakerName}的身份，针对以上讨论内容做出回应。要求：\n1. 必须直接引用或回应前面发言者(${otherNames || '其他参与者'})的具体观点\n2. 提出新的角度或深化讨论，不要重复已有观点\n3. 可以表示赞同、质疑或补充，但必须推进讨论\n4. 保持你作为${speakerName}的独特风格\n\n主题：${topic}`;
      }

      // Generate response from current speaker
      const response = await aiService.generateGhostResponse(
        currentSpeaker,
        roundPrompt,
        null  // 上下文已经内嵌在prompt中，不再重复传递
      );

      // Save message
      const messageId = uuidv4();
      await db.query(
        'INSERT INTO chat_messages (id, session_id, ghost_id, round_number, content, tokens_used, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [messageId, sessionId, currentSpeaker.id, roundNumber, response.content, response.tokens_used, timestamp]
      );

      messages.push({
        id: messageId,
        ghost_id: currentSpeaker.id,
        ghost_name: currentSpeaker.display_name || currentSpeaker.name || currentSpeaker.id,
        ghost_icon: currentSpeaker.icon || '👤',
        round_number: roundNumber,
        content: response.content,
        tokens_used: response.tokens_used
      });

      // Write to discussion log
      await this.writeDiscussionLog(sessionId, topic, roundNumber, currentSpeaker, response.content);

      // Build context for next speaker - 使用安全的名称
      discussionContext = messages
        .map(m => `【${m.ghost_name}】(第${m.round_number}轮): ${m.content}`)
        .join('\n\n---\n\n');

      // Determine next speaker
      if (roundNumber === maxRounds) {
        // Last round, main ghost makes summary
        const mainGhost = ghosts[0];  // 定义主Ghost（第一个Ghost）
        const summary = await this.generateSummary(mainGhost, topic, messages);
        const summaryId = uuidv4();

        await db.query(
          'INSERT INTO chat_messages (id, session_id, ghost_id, round_number, content, tokens_used, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [summaryId, sessionId, mainGhost.id, roundNumber + 1, summary.content, summary.tokens_used, timestamp]
        );

        messages.push({
          id: summaryId,
          ghost_id: mainGhost.id,
          ghost_name: (mainGhost.display_name || mainGhost.name || mainGhost.id) + ' (总结)',
          ghost_icon: mainGhost.icon || '👤',
          round_number: roundNumber + 1,
          content: summary.content,
          tokens_used: summary.tokens_used
        });

        // Save consensus
        const consensus = this.extractConsensusPoints(summary.content);
        await this.saveConsensus(sessionId, consensus, timestamp);

        // Write summary to log
        await this.writeDiscussionLog(sessionId, topic, 'SUMMARY', mainGhost, summary.content);

        break;
      }

      roundNumber++;
    }

    // Update session status
    await db.query(
      'UPDATE chat_sessions SET status = $1, updated_at = $2 WHERE id = $3',
      ['completed', timestamp, sessionId]
    );

    return {
      session_id: sessionId,
      topic,
      messages,
      max_rounds: maxRounds
    };
  }

  async generateSummary(mainGhost, topic, messages) {
    // 只提取真正的讨论内容，排除总结
    const discussion = messages
      .filter(m => m.ghost_name && !m.ghost_name.includes('(总结)'))
      .map(m => `${m.ghost_name}: ${m.content}`)
      .join('\n\n');

    const prompt = `作为讨论的主持人，请对以下关于"${topic}"的讨论做总结：

${discussion}

请提供一个全面、深入的总结，包括：
1. 讨论的主要观点
2. 不同角色的立场差异
3. 达成共识的地方
4. 值得进一步探讨的问题`;

    try {
      const response = await aiService.generateGhostResponse(mainGhost, prompt, null);
      return response;
    } catch (error) {
      console.error('Failed to generate summary:', error);
      return {
        content: `讨论总结：本次关于"${topic}"的讨论中，各位角色从不同角度发表了看法。通过多轮交流，大家深入探讨了该话题的各个方面，达成了一些共识，也识别出了一些需要进一步探讨的问题。`,
        tokens_used: 0
      };
    }
  }

  extractConsensusPoints(summaryContent) {
    const points = summaryContent
      .split(/\n+|\d+\./)
      .map(p => p.trim())
      .filter(p => p.length > 10)
      .slice(0, 6);

    return points.length > 0 ? points : [
      '讨论揭示了话题的核心内涵',
      '不同角色提供了独特的视角',
      '通过交流达成了初步共识',
      '识别出需要进一步探讨的问题',
      '讨论具有建设性意义'
    ];
  }

  async saveConsensus(sessionId, points, timestamp) {
    const consensusId = uuidv4();
    await db.query(
      'INSERT INTO chat_consensus (id, session_id, points, generated_by, created_at) VALUES ($1, $2, $3, $4, $5)',
      [consensusId, sessionId, JSON.stringify(points), 'ai', timestamp]
    );
  }

  async writeDiscussionLog(sessionId, topic, roundNumber, ghost, content) {
    const recordsDir = path.join(__dirname, '../../records');
    const date = new Date().toISOString().split('T')[0];

    // Create records directory if it doesn't exist
    try {
      await fs.mkdir(recordsDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    const logFileName = `${date}_${sessionId.slice(0, 8)}_${topic.slice(0, 20)}.md`;
    const logFilePath = path.join(recordsDir, logFileName);

    // Format log entry
    const timestamp = new Date().toLocaleString('zh-CN');
    const logEntry = `## 第${roundNumber === 'SUMMARY' ? '总结' : roundNumber}轮 - ${ghost.display_name || ghost.name || ghost.id}
**时间**: ${timestamp}

${content}

---
`;

    // Append to log file
    try {
      await fs.appendFile(logFilePath, logEntry, { encoding: 'utf8' });
    } catch (error) {
      console.error('Failed to write discussion log:', error);
    }
  }

  async getDiscussionLogs(sessionId) {
    const recordsDir = path.join(__dirname, '../../records');

    try {
      const files = await fs.readdir(recordsDir);
      const logFiles = files.filter(f => f.includes(sessionId.slice(0, 8)));

      const logs = [];
      for (const file of logFiles) {
        const content = await fs.readFile(path.join(recordsDir, file), 'utf8');
        logs.push({
          filename: file,
          content
        });
      }

      return logs;
    } catch (error) {
      console.error('Failed to get discussion logs:', error);
      return [];
    }
  }
}

module.exports = new FlowService();
