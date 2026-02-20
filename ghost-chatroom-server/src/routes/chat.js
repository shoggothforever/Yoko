const flowService = require('../services/flow-service');
const db = require('../db');

async function chatRoutes(fastify, options) {
  // Start new chat with
  fastify.post('/start', async (request, reply) => {
    try {
      console.log('Starting new chat session', request.body);

      const { topic, ghost_ids, user_id, max_rounds, main_ghost } = request.body;

      if (!topic || !ghost_ids || !Array.isArray(ghost_ids) || ghost_ids.length === 0) {
        return reply.code(400).send({
          error: 'Missing required fields',
          message: 'Topic and ghost_ids are required'
        });
      }

      const options = {
        maxRounds: max_rounds || 6,
        mainGhost: main_ghost
      };

      const result = await flowService.startFlow(topic, ghost_ids, user_id, options);

      console.log('Chat session started successfully', { session_id: result.session_id });

      return reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Failed to start chat', error);

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // Get session details
  fastify.get('/session/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      console.log('Getting chat session', { session_id: id });

      const sessionResult = await db.query(
        'SELECT * FROM chat_sessions WHERE id = $1',
        [id]
      );

      if (sessionResult.rows.length === 0) {
        return reply.code(404).send({
          error: 'Session Not Found',
          message: 'The requested chat session does not exist'
        });
      }

      const session = sessionResult.rows[0];

      // Get messages
      const messagesResult = await db.query(
        `SELECT cm.*, g.display_name as ghost_name, g.icon as ghost_icon
         FROM chat_messages cm
         JOIN ghosts g ON cm.ghost_id = g.id
         WHERE cm.session_id = $1
         ORDER BY cm.round_number, cm.created_at`,
        [id]
      );

      // Get consensus
      const consensusResult = await db.query(
        'SELECT * FROM chat_consensus WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
        [id]
      );

      console.log('Chat session retrieved successfully', { session_id: id });

      return reply.send({
        success: true,
        data: {
          session,
          messages: messagesResult.rows,
          consensus: consensusResult.rows[0]
        }
      });
    } catch (error) {
      console.error('Failed to get chat session', error);

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // Get user sessions list
  fastify.get('/sessions', async (request, reply) => {
    try {
      const { user_id, limit = 20, offset = 0 } = request.query;

      if (!user_id) {
        return reply.code(400).send({
          error: 'Missing required field',
          message: 'user_id is required'
        });
      }

      console.log('Getting user chat sessions', { user_id, limit, offset });

      const result = await db.query(
        `SELECT cs.*, COUNT(cm.id) as message_count
         FROM chat_sessions cs
         LEFT JOIN chat_messages cm ON cs.id = cm.session_id
         WHERE cs.user_id = $1
         GROUP BY cs.id
         ORDER BY cs.created_at DESC
         LIMIT $2 OFFSET $3`,
        [user_id, parseInt(limit), parseInt(offset)]
      );

      console.log('User chat sessions retrieved successfully', { user_id, count: result.rows.length });

      return reply.send({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Failed to get user chat sessions', error);

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // Get discussion logs for a session
  fastify.get('/session/:id/logs', async (request, reply) => {
    try {
      const { id } = request.params;
      console.log('Getting discussion logs', { session_id: id });

      const logs = await flowService.getDiscussionLogs(id);

      return reply.send({
        success: true,
        data: logs
      });
    } catch (error) {
      console.error('Failed to get discussion logs', error);

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // Delete session
  fastify.delete('/session/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { user_id } = request.query;

      if (!user_id) {
        return reply.code(400).send({
          error: 'Missing required field',
          message: 'user_id is required'
        });
      }

      console.log('Deleting chat session', { session_id: id, user_id });

      // Verify session belongs to user
      const sessionResult = await db.query(
        'SELECT user_id FROM chat_sessions WHERE id = $1',
        [id]
      );

      if (sessionResult.rows.length === 0) {
        return reply.code(404).send({
          error: 'Session Not Found',
          message: 'The requested chat session does not exist'
        });
      }

      if (sessionResult.rows[0].user_id !== user_id) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to delete this session'
        });
      }

      await db.query('DELETE FROM chat_sessions WHERE id = $1', [id]);

      console.log('Chat session deleted successfully', { session_id: id, user_id });

      return reply.send({
        success: true,
        data: { deleted: true }
      });
    } catch (error) {
      console.error('Failed to delete chat session', error);

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
}

module.exports = chatRoutes;
