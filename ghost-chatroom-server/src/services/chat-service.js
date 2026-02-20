const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const aiService = require('./ai-service');

class ChatService {
  async startChat(topic, ghostIds, userId = null) {
    const sessionId = uuidv4();
    const timestamp = new Date().toISOString();

    try {
      // Create session
      await db.query(
        'INSERT INTO chat_sessions (id, topic, user_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
        [sessionId, topic, userId, timestamp, timestamp]
      );

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

      // Generate first round of dialogue
      const messages = [];
      let roundNumber = 1;

      // First ghost responds to the topic
      const firstGhost = ghosts[0];
      const firstResponse = await aiService.generateGhostResponse(firstGhost, topic, null);

      const firstMessageId = uuidv4();
      await db.query(
        'INSERT INTO chat_messages (id, session_id, ghost_id, round_number, content, tokens_used, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [firstMessageId, sessionId, firstGhost.id, roundNumber, firstResponse.content, firstResponse.tokens_used, timestamp]
      );

      messages.push({
        id: firstMessageId,
        ghost_id: firstGhost.id,
        ghost_name: firstGhost.display_name,
        ghost_icon: firstGhost.icon,
        round_number: roundNumber,
        content: firstResponse.content,
        tokens_used: firstResponse.tokens_used
      });

      // If there are other ghosts, let them respond in turn
      for (let i = 1; i < ghosts.length; i++) {
        const ghost = ghosts[i];
        const context = `${firstGhost.display_name}的观点：${firstResponse.content}`;
        const response = await aiService.generateGhostResponse(ghost, topic, context);

        const messageId = uuidv4();
        await db.query(
          'INSERT INTO chat_messages (id, session_id, ghost_id, round_number, content, tokens_used, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [messageId, sessionId, ghost.id, roundNumber, response.content, response.tokens_used, timestamp]
        );

        messages.push({
          id: messageId,
          ghost_id: ghost.id,
          ghost_name: ghost.display_name,
          ghost_icon: ghost.icon,
          round_number: roundNumber,
          content: response.content,
          tokens_used: response.tokens_used
        });
      }

      // Generate consensus summary
      const consensus = await aiService.generateConsensus(sessionId, messages);
      const consensusId = uuidv4();
      await db.query(
        'INSERT INTO chat_consensus (id, session_id, points, generated_by, created_at) VALUES ($1, $2, $3, $4, $5)',
        [consensusId, sessionId, JSON.stringify(consensus), 'ai', timestamp]
      );

      // Update session status to completed
      await db.query(
        'UPDATE chat_sessions SET status = $1, updated_at = $2 WHERE id = $3',
        ['completed', timestamp, sessionId]
      );

      return {
        session_id: sessionId,
        topic,
        messages,
        consensus
      };

    } catch (error) {
      console.error('Error starting chat:', error);

      // Cleanup: delete the created session
      await db.query('DELETE FROM chat_sessions WHERE id = $1', [sessionId]).catch(() => {});

      throw new Error(`Failed to start chat: ${error.message}`);
    }
  }

  async getSession(sessionId) {
    const sessionResult = await db.query(
      'SELECT * FROM chat_sessions WHERE id = $1',
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      throw new Error('Session not found');
    }

    const session = sessionResult.rows[0];

    // Get messages
    const messagesResult = await db.query(
      `SELECT cm.*, g.display_name as ghost_name, g.icon as ghost_icon
       FROM chat_messages cm
       JOIN ghosts g ON cm.ghost_id = g.id
       WHERE cm.session_id = $1
       ORDER BY cm.round_number, cm.created_at`,
      [sessionId]
    );

    // Get consensus
    const consensusResult = await db.query(
      'SELECT * FROM chat_consensus WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
      [sessionId]
    );

    return {
      session,
      messages: messagesResult.rows,
      consensus: consensusResult.rows[0]
    };
  }

  async getUserSessions(userId, limit = 20, offset = 0) {
    const result = await db.query(
      `SELECT cs.*, COUNT(cm.id) as message_count
       FROM chat_sessions cs
       LEFT JOIN chat_messages cm ON cs.id = cm.session_id
       WHERE cs.user_id = $1
       GROUP BY cs.id
       ORDER BY cs.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  }

  async deleteSession(sessionId, userId) {
    // Verify that the session belongs to the user
    const sessionResult = await db.query(
      'SELECT user_id FROM chat_sessions WHERE id = $1',
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      throw new Error('Session not found');
    }

    if (sessionResult.rows[0].user_id !== userId) {
      throw new Error('Unauthorized to delete this session');
    }

    await db.query('DELETE FROM chat_sessions WHERE id = $1', [sessionId]);

    return { success: true };
  }
}

module.exports = new ChatService();
