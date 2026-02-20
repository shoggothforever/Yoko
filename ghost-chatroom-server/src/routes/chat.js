const chatService = require('../services/chat-service');

async function chatRoutes(fastify, options) {
  // Start new chat
  fastify.post('/start', async (request, reply) => {
    try {
      console.log('Starting new chat session', request.body);

      const { topic, ghost_ids, user_id } = request.body;

      if (!topic || !ghost_ids || !Array.isArray(ghost_ids) || ghost_ids.length === 0) {
        return reply.code(400).send({
          error: 'Missing required fields',
          message: 'Topic and ghost_ids are required'
        });
      }

      const result = await chatService.startChat(topic, ghost_ids, user_id);

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

      const result = await chatService.getSession(id);

      console.log('Chat session retrieved successfully', { session_id: id });

      return reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Failed to get chat session', error);

      if (error.message === 'Session not found') {
        return reply.code(404).send({
          error: 'Session Not Found',
          message: 'The requested chat session does not exist'
        });
      }

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

      const result = await chatService.getUserSessions(user_id, parseInt(limit), parseInt(offset));

      console.log('User chat sessions retrieved successfully', { user_id, count: result.length });

      return reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Failed to get user chat sessions', error);

      if (error.message === 'Session not found') {
        return reply.code(404).send({
          error: 'Session Not Found',
          message: error.message
        });
      }

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

      const result = await chatService.deleteSession(id, user_id);

      console.log('Chat session deleted successfully', { session_id: id, user_id });

      return reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Failed to delete chat session', error);

      if (error.message === 'Session not found') {
        return reply.code(404).send({
          error: 'Session Not Found',
          message: 'The requested chat session does not exist'
        });
      }

      if (error.message === 'Unauthorized to delete this session') {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'You are not authorized to delete this session'
        });
      }

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
}

module.exports = chatRoutes;
