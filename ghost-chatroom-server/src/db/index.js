const { Pool } = require('pg');
const config = require('../config');

class Database {
  constructor() {
    this.pool = new Pool({
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      user: config.db.user,
      password: config.db.password,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (err) {
      console.error('Database query error', { text, params, error: err.message });
      throw err;
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  async close() {
    await this.pool.end();
  }

  async initializeSchema() {
    try {
      // Check if tables already exist
      const tables = await this.pool.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name IN ('ghosts', 'chat_sessions', 'chat_messages', 'chat_consensus')
      `);

      // Drop only if they exist
      if (tables.rows.some(t => t.table_name === 'ghosts')) {
        await this.pool.query('DROP TABLE IF EXISTS ghosts CASCADE');
      }
      if (tables.rows.some(t => t.table_name === 'chat_sessions')) {
        await this.pool.query('DROP TABLE IF EXISTS chat_sessions CASCADE');
      }
      if (tables.rows.some(t => t.table_name === 'chat_messages')) {
        await this.pool.query('DROP TABLE IF EXISTS chat_messages CASCADE');
      }
      if (tables.rows.some(t => t.table_name === 'chat_consensus')) {
        await this.pool.query('DROP TABLE IF EXISTS chat_consensus CASCADE');
      }

      // Create ghosts table
      await this.pool.query(`
        CREATE TABLE ghosts (
          id VARCHAR(50) PRIMARY KEY,
          name TEXT,
          display_name TEXT NOT NULL,
          icon VARCHAR(10),
          source TEXT,
          description TEXT,
          soul_prompt TEXT NOT NULL,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create chat_sessions table
      await this.pool.query(`
        CREATE TABLE chat_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          topic TEXT NOT NULL,
          user_id VARCHAR(100),
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create chat_messages table
      await this.pool.query(`
        CREATE TABLE chat_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
          ghost_id VARCHAR(50) REFERENCES ghosts(id),
          round_number INTEGER NOT NULL,
          content TEXT NOT NULL,
          tokens_used INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create chat_consensus table
      await this.pool.query(`
        CREATE TABLE chat_consensus (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
          points JSONB NOT NULL,
          generated_by VARCHAR(50) DEFAULT 'ai',
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create indexes
      await this.pool.query('CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id)');
      await this.pool.query('CREATE INDEX idx_chat_sessions_status ON chat_sessions(status)');
      await this.pool.query('CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id)');
      await this.pool.query('CREATE INDEX idx_chat_consensus_session_id ON chat_consensus(session_id)');

      console.log('Database schema initialized successfully');
    } catch (err) {
      console.error('Failed to initialize database schema:', err);
      throw err;
    }
  }

  async seedGhosts() {
    const ghosts = [
      {
        id: 'gally',
        name: 'galley',
        display_name: 'Gally',
        icon: '🦊',
        description: '来自废铁镇的战斗天使，灵魂与钢铁的融合。相信灵魂在战斗中锤炼，在碰撞中显现。',
        soul_prompt: '作为来自《铳梦》的Gally，我是废铁镇的战斗天使，经历无数战斗的灵魂与钢铁的融合。我相信灵魂在战斗中锤炼，在碰撞中显现。'
      },
      {
        id: 'motoko',
        name: 'motoko',
        display_name: 'Motoko',
        icon: '👤',
        description: '公安9课少佐，Ghost与网络的进化。相信Ghost是动态过程，在网络同步中超越物理限制。',
        soul_prompt: '我是公安9课少佐草薙素子，我相信Ghost是动态过程，在网络同步中超越物理限制。'
      }
    ];

    try {
      for (const ghost of ghosts) {
        await this.pool.query(
          'INSERT INTO ghosts (id, name, display_name, icon, description, soul_prompt) VALUES ($1, $2, $3, $4, $5, $6)',
          [ghost.id, ghost.name, ghost.display_name, ghost.icon, ghost.description, ghost.soul_prompt]
        );
      }
      console.log('Ghosts seeded successfully');
    } catch (err) {
      console.error('Failed to seed ghosts:', err);
      throw err;
    }
  }
}

module.exports = new Database();
