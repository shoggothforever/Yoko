const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
// const re = require('re');

// 配置
const MEMORY_DIR = '/root/.openclaw/workspace/memory';
const POSTS_DIR = '/root/.openclaw/workspace/yoko-blog/posts';

// 缓存
let explorationCache = {
  data: null,
  timestamp: 0,
  ttl: 60 * 1000 // 60秒
};

/**
 * 解析记忆文件提取探索信息
 */
async function parseMemoryFile(dateStr) {
  const filepath = path.join(MEMORY_DIR, `${dateStr}.md`);
  
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    
    // 提取主题
    const themeMatch = content.match(/主题：\s*(.+?)\s*\n/);
    const theme = themeMatch ? themeMatch[1].trim() : '探索';
    
    // 提取状态
    const statusMatch = content.match(/状态：\s*✅?\s*(.+?)\s*\n/);
    const status = statusMatch ? statusMatch[1].trim() : '';
    
    // 计算探索深度
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
    
    return {
      theme,
      status,
      level,
      content_length: contentLength
    };
  } catch (error) {
    return null;
  }
}

/**
 * 获取所有探索数据
 */
async function getExplorationData() {
  const now = Date.now();
  
  // 检查缓存
  if (explorationCache.data && (now - explorationCache.timestamp) < explorationCache.ttl) {
    return explorationCache.data;
  }
  
  try {
    const files = await fs.readdir(MEMORY_DIR);
    const explorations = {};
    
    // 查找所有 YYYY-MM-DD.md 文件
    for (const filename of files) {
      const match = filename.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
      if (match) {
        const dateStr = match[1];
        const data = await parseMemoryFile(dateStr);
        if (data) {
          explorations[dateStr] = data;
        }
      }
    }
    
    // 按日期排序
    const sortedDates = Object.keys(explorations).sort().reverse();
    
    // 计算统计
    const totalDays = sortedDates.length;
    
    // 获取本月探索
    const today = new Date();
    const currentMonth = today.toISOString().split('T')[0].substring(0, 7);
    const monthExplorations = sortedDates.filter(d => d.startsWith(currentMonth));
    
    // 构建响应
    const response = {
      timestamp: now,
      stats: {
        total_days: totalDays,
        total_articles: 31,
        standardization_rate: '100%',
        month_explorations: monthExplorations.length
      },
      explorations,
      recent_dates: sortedDates.slice(0, 10)
    };
    
    // 更新缓存
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

/**
 * OpenClaw会命令帮助函数
 */
function execOpenClaw(command) {
  return new Promise((resolve, reject) => {
    exec(`openclaw ${command}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        try {
          resolve(JSON.parse(stdout));
        } catch (e) {
          resolve(stdout);
        }
      }
    });
  });
}

/**
 * 会话数据路由
 */
async function sessionRoutes(fastify, options) {
  // 获取主会话统计
  fastify.get('/main', async (request, reply) => {
    try {
      // 这里可以调用 openclaw sessions list --json
      // 暂时返回模拟数据
      return reply.send({
        success: true,
        data: {
          agent: 'galley',
          model: 'ark/glm-4.7',
          runtime: {
            host: 'iv-yefsy2zri8t56onae6im',
            os: 'Linux 6.8.0-55-generic (x64)',
            node: 'v22.22.0'
          },
          uptime: process.uptime()
        }
      });
    } catch (error) {
      console.error('Failed to get session data:', error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
  
  // 获取所有会话列表
  fastify.get('/list', async (request, reply) => {
    try {
      // 调用 openclaw sessions list --json
      const sessions = await execOpenClaw('sessions list --json');
      
      return reply.send({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Failed to get session list:', error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
}

/**
 * Cron任务数据路由
 */
async function cronRoutes(fastify, options) {
  // 获取Cron任务列表
  fastify.get('/list', async (request, reply) => {
    try {
      // 调用 openclaw cron list --json
      const jobs = await execOpenClaw('cron list --json');
      
      return reply.send({
        success: true,
        data: jobs
      });
    } catch (error) {
      console.error('Failed to get cron list:', error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
  
  // 获取Cron任务运行历史
  fastify.get('/:jobId/runs', async (request, reply) => {
    try {
      const { jobId } = request.params;
      
      // 调用 openclaw cron runs --jobId <jobId>
      const runs = await execOpenClaw(`cron runs --jobId ${jobId}`);
      
      return reply.send({
        success: true,
        data: runs
      });
    } catch (error) {
      console.error('Failed to get cron runs:', error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
}

/**
 * 探索Dashboard数据路由
 */
async function explorationRoutes(fastify, options) {
  // 获取所有探索数据
  fastify.get('/data', async (request, reply) => {
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
  
  // 统计数据（简化版）
  fastify.get('/stats', async (request, reply) => {
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
}

/**
 * 子代理数据路由
 */
async function subagentRoutes(fastify, options) {
  // 获取活动子代理列表
  fastify.get('/list', async (request, reply) => {
    try {
      // 调用 openclaw subagents list
      const subagents = await execOpenClaw('subagents list --json');
      
      return reply.send({
        success: true,
        data: subagents
      });
    } catch (error) {
      console.error('Failed to get subagent list:', error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
}

module.exports = {
  sessionRoutes,
  cronRoutes,
  explorationRoutes,
  subagentRoutes
};
