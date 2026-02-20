const db = require('../db');
const aiService = require('../services/ai-service');

async function ghostsRoutes(fastify, options) {
  // Get all active ghosts
  fastify.get('/active', async (request, reply) => {
    try {
      console.log('Getting active ghosts');
      const agents = await aiService.getAgents();

      console.log(`Active ghosts retrieved successfully: ${agents.length}`);
      return reply.send({
        success: true,
        data: agents
      });
    } catch (error) {
      console.error('Failed to get active ghosts', error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // Get a specific ghost by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      console.log('Getting ghost', { ghost_id: id });

      const ghost = await aiService.getGhost(id);

      if (!ghost) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'The requested ghost does not exist'
        });
      }

      console.log('Ghost retrieved successfully', { ghost_id: id });
      return reply.send({
        success: true,
        data: ghost
      });
    } catch (error) {
      console.error('Failed to get ghost', error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
}

module.exports = ghostsRoutes;
