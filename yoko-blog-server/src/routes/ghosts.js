const db = require('../db');
const aiService = require('../services/ai-service');

async function ghostsRoutes(fastify, options) {
  // Get all active ghosts from database
  fastify.get('/active', async (request, reply) => {
    try {
      console.log('Getting active ghosts from database');
      const result = await db.query(
        'SELECT * FROM ghosts WHERE is_active = true ORDER BY id'
      );

      const ghosts = result.rows.map(row => ({
        id: row.id,
        name: row.name || row.id,
        display_name: row.display_name,
        icon: row.icon,
        source: row.source,
        description: row.description,
        soul_prompt: row.soul_prompt
      }));

      console.log(`Active ghosts retrieved successfully: ${ghosts.length}`);
      return reply.send({
        success: true,
        data: ghosts
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

      const result = await db.query(
        'SELECT * FROM ghosts WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'The requested ghost does not exist'
        });
      }

      const ghost = result.rows[0];

      console.log('Ghost retrieved successfully', { ghost_id: id });
      return reply.send({
        success: true,
        data: {
          id: ghost.id,
          name: ghost.name || ghost.id,
          display_name: ghost.display_name,
          icon: ghost.icon,
          source: ghost.source,
          description: ghost.description,
          soul_prompt: ghost.soul_prompt
        }
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
