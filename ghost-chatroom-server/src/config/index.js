require('dotenv').config();

const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT) || 3001,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development'
  },

  // Database configuration
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'ghost_chatroom',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'ghost_chatroom'
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN === 'false' ? false : process.env.CORS_ORIGIN || true
  },

  // Rate limiting configuration
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    timeWindow: process.env.RATE_LIMIT_TIME_WINDOW || '1 minute'
  }
};

module.exports = config;
