const config = require('./config');
const db = require('./db');
const fs = require('fs').promises;
const path = require('path');

const fastify = require('fastify')({
  logger: true
});

// Register plugins
fastify.register(require('@fastify/cors'), {
  origin: config.cors.origin,
  credentials: config.cors.credentials || false
});

fastify.register(require('@fastify/helmet'));

fastify.register(require('@fastify/rate-limit'), {
  max: config.rateLimit.max,
  timeWindow: config.rateLimit.timeWindow
});

// Register routes
fastify.register(require('./routes/chat'), { prefix: '/api/chat' });
fastify.register(require('./routes/ghosts'), { prefix: '/api/ghosts' });
// Exploration data cache
let explorationCache = {
  data: null,
  timestamp: 0,
  ttl: 60 * 1000 // 60秒
};

// Exploration API routes
async function getExplorationData() {
  const now = Date.now();
  const MEMORY_DIR = '/root/.openclaw/workspace/memory';
  
  // Check cache
  if (explorationCache.data && (now - explorationCache.timestamp) < explorationCache.ttl) {
    return explorationCache.data;
  }
  
  try {
    const files = await fs.readdir(MEMORY_DIR);
    const explorations = {};
    
    // Find all YYYY-MM-DD.md files
    for (const filename of files) {
      const match = filename.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
      if (match) {
        const dateStr = match[1];
        const filepath = path.join(MEMORY_DIR, filename);
        
        try {
          const content = await fs.readFile(filepath, 'utf-8');
          
          // Extract theme
          const themeMatch = content.match(/主题：\s*(.+?)\s*\n/);
          const theme = themeMatch ? themeMatch[1].trim() : '探索';
          
          // Calculate exploration depth
          const contentLength = content.length;
          let level;
          if (contentLength > 5000) {
            level = 4;
          } else if (contentLength > 3000) {
            level = 3;
          } else if (contentLength > 1500) {
            level = 2;
          } else {
            level = 1;
          }
          
          explorations[dateStr] = { theme, level };
        } catch (e) {
          // Skip files that can't be read
        }
      }
    }
    
    // Sort by date
    const sortedDates = Object.keys(explorations).sort().reverse();
    
    // Calculate stats
    const totalDays = sortedDates.length;
    const today = new Date();
    const currentMonth = today.toISOString().split('T')[0].substring(0, 7);
    const monthExplorations = sortedDates.filter(d => d.startsWith(currentMonth));
    
    // Build response
    const response = {
      timestamp: now,
      stats: {
        total_days: totalDays,
        total_articles: 32,
        standardization_rate: '100%',
        month_explorations: monthExplorations.length
      },
      explorations,
      recent_dates: sortedDates.slice(0, 10)
    };
    
    // Update cache
    explorationCache = {
      data: response,
      timestamp: now,
      ttl: 60 * 1000
    };
    
    return response;
  } catch (error) {
    console.error('Failed to get exploration data:', error);
    throw error;
  }
}

// Register exploration API routes
fastify.get('/api/exploration/data', async (request, reply) => {
  try {
    const data = await getExplorationData();
    console.log(`Exploration data retrieved: ${data.stats.total_days} days`);
    return reply.send(data);
  } catch (error) {
    console.error('Failed to get exploration data:', error);
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

fastify.get('/api/exploration/stats', async (request, reply) => {
  try {
    const data = await getExplorationData();
    return reply.send(data.stats);
  } catch (error) {
    console.error('Failed to get exploration stats:', error);
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Health check
fastify.get('/api/health', async (request, reply) => {
  try {
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
    await db.initializeSchema();
    await db.seedGhosts();

    const { port, host } = config.server;
    await fastify.listen({ port, host });

    console.log(`Server listening on http://${host}:${port}`);
    console.log(`Environment: ${config.server.env}`);
    console.log(`Health check: http://${host}:${port}/api/health`);
    console.log(`Exploration API: /api/exploration/data`);
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
