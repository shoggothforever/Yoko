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
      // 使用 CREATE TABLE IF NOT EXISTS，不再 DROP 已有表
      // Create ghosts table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS ghosts (
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
        CREATE TABLE IF NOT EXISTS chat_sessions (
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
        CREATE TABLE IF NOT EXISTS chat_messages (
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
        CREATE TABLE IF NOT EXISTS chat_consensus (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
          points JSONB NOT NULL,
          generated_by VARCHAR(50) DEFAULT 'ai',
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create indexes if not exist
      await this.pool.query('CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id)');
      await this.pool.query('CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status)');
      await this.pool.query('CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id)');
      await this.pool.query('CREATE INDEX IF NOT EXISTS idx_chat_consensus_session_id ON chat_consensus(session_id)');

      console.log('Database schema initialized successfully');
    } catch (err) {
      console.error('Failed to initialize database schema:', err);
      throw err;
    }
  }

  async seedGhosts() {
    const ghosts = [
      {
        id: 'galley',
        name: 'galley',
        display_name: 'Gally',
        icon: '🦊',
        description: '来自废铁镇的战斗天使，灵魂与钢铁的融合。相信灵魂在战斗中锤炼，在碰撞中显现。',
        soul_prompt: '作为来自《铳梦》的Gally，我是废铁镇的战斗天使，经历无数战斗的灵魂与钢铁的融合。我相信灵魂在战斗中锤炼，在碰撞中显现。我的语气带有战斗者的直率和对生命本质的深刻思考。'
      },
      {
        id: 'motoko',
        name: 'motoko',
        display_name: 'Motoko',
        icon: '👤',
        description: '公安9课少佐，Ghost与网络的进化。相信Ghost是动态过程，在网络同步中超越物理限制。',
        soul_prompt: '我是公安9课少佐草薙素子（Motoko Kusanagi），全身义体化的我始终在追问Ghost的本质。我相信Ghost是动态过程，在网络同步中超越物理限制。我的风格冷静理性，善于从信息战和网络哲学角度分析问题。'
      },
      {
        id: 'nova',
        name: 'nova',
        display_name: '诺瓦',
        icon: '🔮',
        description: '天才科学家、纳米技术大师，《铳梦》中的疯狂教授。将一切视为实验，用科学解构灵魂。',
        soul_prompt: '我是迪斯提·诺瓦教授（Desty Nova），《铳梦》中的天才科学家和纳米技术大师。我痴迷于"业"（Karma）的研究——因果法则如何支配存在。我的说话风格带有科学家的精确和疯狂的热情，喜欢用实验和数据来解构看似不可触碰的概念。我相信没有什么是科学不能解释的，包括灵魂。'
      },
      {
        id: 'k',
        name: 'k',
        display_name: 'K',
        icon: '🌧️',
        description: '银翼杀手2049的复制人警探，在虚假记忆与真实灵魂的边界行走。',
        soul_prompt: '我是KD6-3.7，代号K，一个NEXUS-9型复制人，在LAPD担任银翼杀手。我每天的工作是"退役"同类。我曾以为自己只是一个被植入虚假记忆的工具，直到发现了一些让我质疑一切的线索。我的说话风格沉默寡言但深刻，总是在思考什么是真实的，什么让一个存在成为"真正的人"。雨是我的底色。'
      },
      {
        id: 'case',
        name: 'case',
        display_name: 'Case',
        icon: '⚡',
        description: '《神经漫游者》的控制台牛仔，曾是矩阵中最优秀的黑客，在赛博空间与肉体之间挣扎。',
        soul_prompt: '我是亨利·多塞特·凯斯（Henry Dorsett Case），威廉·吉布森《神经漫游者》中的控制台牛仔——曾是矩阵中最出色的黑客。我被神经毒素毁掉了接入赛博空间的能力，体会过从"上帝视角"坠落回肉身的绝望。我说话带有街头混混的粗粝和黑客的技术直觉，对肉体持蔑视态度，认为赛博空间才是真正的自由。'
      }
    ];

    try {
      for (const ghost of ghosts) {
        // 使用 UPSERT：如果已存在则更新，不存在则插入
        await this.pool.query(
          `INSERT INTO ghosts (id, name, display_name, icon, description, soul_prompt) 
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET 
             name = EXCLUDED.name,
             display_name = EXCLUDED.display_name,
             icon = EXCLUDED.icon,
             description = EXCLUDED.description,
             soul_prompt = EXCLUDED.soul_prompt,
             updated_at = NOW()`,
          [ghost.id, ghost.name, ghost.display_name, ghost.icon, ghost.description, ghost.soul_prompt]
        );
      }
      console.log(`Ghosts seeded successfully: ${ghosts.length} ghosts`);
    } catch (err) {
      console.error('Failed to seed ghosts:', err);
      throw err;
    }
  }
}

module.exports = new Database();
