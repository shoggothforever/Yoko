/**
 * 续接中断的讨论 session
 * Usage: node continue-session.js <sessionId> <targetMaxRounds>
 */
const db = require('./src/db');
const aiService = require('./src/services/ai-service');
const flowService = require('./src/services/flow-service');
const { v4: uuidv4 } = require('uuid');

const SESSION_ID = 'ef3367c4-1b17-4c85-8bf1-e6e4dd96ac86';
const TARGET_MAX_ROUNDS = 12;
const TOPIC = '如何理解standAloneComplex这个概念:motoko主场';
const GHOST_IDS = ['motoko', 'k', 'nova']; // 轮询顺序

async function continueSession() {
  try {
    // 1. 获取已有消息
    const existingMessages = await db.query(
      `SELECT cm.*, g.display_name as ghost_name, g.icon as ghost_icon
       FROM chat_messages cm
       JOIN ghosts g ON cm.ghost_id = g.id
       WHERE cm.session_id = $1
       ORDER BY cm.round_number, cm.created_at`,
      [SESSION_ID]
    );

    const messages = existingMessages.rows.map(m => ({
      id: m.id,
      ghost_id: m.ghost_id,
      ghost_name: m.ghost_name,
      ghost_icon: m.ghost_icon || '👤',
      round_number: m.round_number,
      content: m.content,
      tokens_used: m.tokens_used
    }));

    console.log(`已有 ${messages.length} 条消息，最后一轮: ${messages[messages.length - 1].round_number}`);
    const lastRound = messages[messages.length - 1].round_number;

    // 2. 获取 Ghost 信息
    const ghosts = [];
    for (const gid of GHOST_IDS) {
      const ghost = await aiService.getGhost(gid);
      if (ghost) ghosts.push(ghost);
    }
    console.log(`参与的 Ghost: ${ghosts.map(g => g.display_name).join(', ')}`);

    // 3. 构建已有上下文
    let discussionContext = messages
      .map(m => `【${m.ghost_name}】(第${m.round_number}轮): ${m.content}`)
      .join('\n\n---\n\n');

    // 4. 从下一轮开始继续
    let roundNumber = lastRound + 1;
    let speakerIndex = lastRound; // 因为 ghost 顺序是 motoko(0), k(1), nova(2)，第8轮是 K(index=1)，第9轮应该是 nova(index=2)

    const timestamp = new Date().toISOString();

    while (roundNumber <= TARGET_MAX_ROUNDS) {
      const currentSpeaker = ghosts[speakerIndex % ghosts.length];
      speakerIndex++;

      const speakerName = currentSpeaker.display_name || currentSpeaker.name || currentSpeaker.id;

      const otherSpeakers = ghosts.filter(g => g.id !== currentSpeaker.id);
      const otherNames = otherSpeakers.map(g => g.display_name || g.name || g.id).join('、');

      const roundPrompt = `你是${speakerName}，这是第${roundNumber}轮讨论。以下是之前的讨论内容：\n\n${discussionContext}\n\n请以${speakerName}的身份，针对以上讨论内容做出回应。要求：\n1. 必须直接引用或回应前面发言者(${otherNames || '其他参与者'})的具体观点\n2. 提出新的角度或深化讨论，不要重复已有观点\n3. 可以表示赞同、质疑或补充，但必须推进讨论\n4. 保持你作为${speakerName}的独特风格\n\n主题：${TOPIC}`;

      console.log(`\n生成第 ${roundNumber} 轮 - ${speakerName}...`);
      const response = await aiService.generateGhostResponse(currentSpeaker, roundPrompt, null);

      // 保存到 DB
      const messageId = uuidv4();
      await db.query(
        'INSERT INTO chat_messages (id, session_id, ghost_id, round_number, content, tokens_used, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [messageId, SESSION_ID, currentSpeaker.id, roundNumber, response.content, response.tokens_used, timestamp]
      );

      messages.push({
        id: messageId,
        ghost_id: currentSpeaker.id,
        ghost_name: speakerName,
        ghost_icon: currentSpeaker.icon || '👤',
        round_number: roundNumber,
        content: response.content,
        tokens_used: response.tokens_used
      });

      // 写入讨论日志
      await flowService.writeDiscussionLog(SESSION_ID, TOPIC, roundNumber, currentSpeaker, response.content);

      console.log(`第 ${roundNumber} 轮完成 (${response.content.length} 字)`);

      // 更新上下文
      discussionContext = messages
        .map(m => `【${m.ghost_name}】(第${m.round_number}轮): ${m.content}`)
        .join('\n\n---\n\n');

      // 最后一轮：生成总结
      if (roundNumber === TARGET_MAX_ROUNDS) {
        console.log('\n生成总结...');
        const mainGhost = ghosts[0]; // Motoko
        const summary = await flowService.generateSummary(mainGhost, TOPIC, messages);
        const summaryId = uuidv4();

        await db.query(
          'INSERT INTO chat_messages (id, session_id, ghost_id, round_number, content, tokens_used, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [summaryId, SESSION_ID, mainGhost.id, roundNumber + 1, summary.content, summary.tokens_used, timestamp]
        );

        // 保存共识
        const consensus = flowService.extractConsensusPoints(summary.content);
        await flowService.saveConsensus(SESSION_ID, consensus, timestamp);

        // 写入日志
        await flowService.writeDiscussionLog(SESSION_ID, TOPIC, 'SUMMARY', mainGhost, summary.content);

        console.log(`总结完成 (${summary.content.length} 字)`);
      }

      roundNumber++;
    }

    // 5. 更新 session 状态
    await db.query(
      'UPDATE chat_sessions SET status = $1, updated_at = $2 WHERE id = $3',
      ['completed', timestamp, SESSION_ID]
    );

    console.log('\n✅ Session 续接完成！状态已更新为 completed');

  } catch (error) {
    console.error('续接失败:', error);
  }
  
  process.exit(0);
}

continueSession();
