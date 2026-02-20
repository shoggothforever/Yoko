const config = require('./config');
const db = require('./db');

const fastify = require('fastify')({
  logger: true
});

// Register plugins
fastify.register(require('@fastify/cors'), {
  origin: config.cors.origin,
  credentials: true
});

fastify.register(require('@fastify/helmet'));

fastify.register(require('@fastify/rate-limit'), {
  max: config.rateLimit.max,
  timeWindow: config.rateLimit.timeWindow
});

// Register routes
fastify.register(require('./routes/chat'), { prefix: '/api/chat' });
fastify.register(require('./routes/ghosts'), { prefix: '/api/ghosts' });

// Health check
fastify.get('/api/health', async (request, reply) => {
  try {
    // Test database connection
    await db.query('SELECT 1');

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.server.env,
      uptime: process.uptime()
    };
  } catch (error) {
    console.error('Health check failed', error);
    return reply.code(503).send({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Initialize database and start server
const start = async () => {
  try {
    // Initialize database schema
    await db.initializeSchema();

    // Seed ghost characters
    await db.seedGhosts();

    const { port, host } = config.server;
    await fastify.listen({ port, host });

    console.log(`Server listening on http://${host}:${port}`);
    console.log(`Environment: ${config.server.env}`);
    console.log(`Health check: http://${host}:${port}/api/health`);
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
