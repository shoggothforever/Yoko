const flowService = require('../services/flow-service');
const db = require('../db');
const fs = require('fs').promises;
const path = require('path');
const recordsDir = path.join(__dirname, '../../records');

async function chatRoutes(fastify, options) {
  // Start new chat — 异步启动，立即返回 session_id
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

      // 校验 max_rounds：必须为正整数，最多12轮
      let validatedRounds = parseInt(max_rounds, 10);
      if (!validatedRounds || validatedRounds < 1) {
        validatedRounds = 6; // 默认6轮
      } else if (validatedRounds > 12) {
        validatedRounds = 12; // 上限12轮
      }

      const options = {
        maxRounds: validatedRounds,
        mainGhost: main_ghost
      };

      // 先创建 session 记录，立即返回 session_id
      const { v4: uuidv4 } = require('uuid');
      const sessionId = uuidv4();
      const timestamp = new Date().toISOString();
      
      await db.query(
        'INSERT INTO chat_sessions (id, topic, user_id, created_at, updated_at, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [sessionId, topic, user_id, timestamp, timestamp, 'active']
      );

      console.log('Chat session created, starting async flow', { session_id: sessionId });

      // 立即返回 session_id，让前端马上建立 SSE 连接
      reply.send({
        success: true,
        data: {
          session_id: sessionId,
          topic,
          status: 'active',
          max_rounds: options.maxRounds
        }
      });

      // 异步执行讨论流程（不阻塞响应）
      // 传入已创建的 sessionId，避免重复创建
      options.sessionId = sessionId;
      flowService.startFlow(topic, ghost_ids, user_id, options).then(result => {
        console.log('Chat session completed successfully', { session_id: sessionId });
      }).catch(error => {
        console.error('Chat session failed', { session_id: sessionId, error: error.message });
        // 更新 session 状态为失败
        db.query(
          'UPDATE chat_sessions SET status = $1, updated_at = $2 WHERE id = $3',
          ['failed', new Date().toISOString(), sessionId]
        ).catch(e => console.error('Failed to update session status:', e));
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

  // SSE endpoint for real-time message updates
  fastify.get('/stream/:id', { websocket: false }, async (request, reply) => {
    const { id } = request.params;
    console.log('SSE connection established', { session_id: id });

    // Set SSE headers
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('X-Accel-Buffering', 'no');
    reply.raw.setHeader('Access-Control-Allow-Origin', '*');

    // Check if session exists
    const sessionResult = await db.query(
      'SELECT id, status, topic FROM chat_sessions WHERE id = $1',
      [id]
    );

    if (sessionResult.rows.length === 0) {
      reply.raw.write(`data: ${JSON.stringify({ type: 'error', error: 'Session not found' })}\n\n`);
      return reply.raw.end();
    }

    const session = sessionResult.rows[0];

    // 发送初始状态（统一用 data-only 格式，前端只需监听 onmessage）
    reply.raw.write(`data: ${JSON.stringify({ type: 'status', status: session.status })}\n\n`);

    // 心跳：每 30 秒发一次，仅用于保持连接（防止代理超时）
    const heartbeatInterval = setInterval(() => {
      try {
        reply.raw.write(`: heartbeat\n\n`);
      } catch (e) {
        clearInterval(heartbeatInterval);
      }
    }, 30000);

    // 安全超时：10 分钟后无论如何都关闭连接（防止僵尸连接）
    const maxTimeout = setTimeout(() => {
      console.log('SSE max timeout reached, closing', { session_id: id });
      cleanup('timeout');
    }, 10 * 60 * 1000);

    let lastMessageCount = 0;
    let pollFailCount = 0;
    let closed = false;

    function cleanup(reason) {
      if (closed) return;
      closed = true;
      console.log('SSE cleanup:', reason, { session_id: id });
      clearInterval(checkInterval);
      clearInterval(heartbeatInterval);
      clearTimeout(maxTimeout);
      try { reply.raw.end(); } catch (e) { /* already closed */ }
    }

    // 轮询间隔：10 秒检查一次（有新消息时会立即发送，无需太频繁）
    const POLL_INTERVAL = 100000;
    const checkInterval = setInterval(async () => {
      if (closed) return;

      try {
        // 一次查询拿到消息数 + 状态，减少 DB 压力
        const [messageCountResult, statusResult] = await Promise.all([
          db.query('SELECT COUNT(*) as count FROM chat_messages WHERE session_id = $1', [id]),
          db.query('SELECT status FROM chat_sessions WHERE id = $1', [id])
        ]);

        const currentCount = parseInt(messageCountResult.rows[0].count);

        if (!statusResult.rows[0]) {
          cleanup('session_deleted');
          return;
        }

        const currentStatus = statusResult.rows[0].status;

        // 只在有新消息时才查询并发送
        if (currentCount > lastMessageCount) {
          const messagesResult = await db.query(
            `SELECT cm.*, g.display_name as ghost_name, g.icon as ghost_icon
             FROM chat_messages cm
             JOIN ghosts g ON cm.ghost_id = g.id
             WHERE cm.session_id = $1
             ORDER BY cm.round_number, cm.created_at`,
            [id]
          );

          const newMessages = messagesResult.rows.slice(lastMessageCount);
          newMessages.forEach(message => {
            reply.raw.write(`data: ${JSON.stringify({ type: 'message', ...message })}\n\n`);
          });

          lastMessageCount = currentCount;
        }

        // 讨论完成 → 发送结果并立即关闭
        if (currentStatus === 'completed') {
          const consensusResult = await db.query(
            'SELECT * FROM chat_consensus WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
            [id]
          );
          reply.raw.write(`data: ${JSON.stringify({ type: 'completed', consensus: consensusResult.rows[0] })}\n\n`);
          cleanup('completed');
          return;
        }

        // 讨论失败 → 通知并关闭
        if (currentStatus === 'failed') {
          reply.raw.write(`data: ${JSON.stringify({ type: 'error', error: '讨论过程中发生错误，但已生成的内容已保存' })}\n\n`);
          cleanup('failed');
          return;
        }

        pollFailCount = 0;
      } catch (error) {
        console.error('SSE check error:', error);
        pollFailCount++;
        if (pollFailCount >= 5) {
          reply.raw.write(`data: ${JSON.stringify({ type: 'error', error: '连接异常，请刷新页面查看结果' })}\n\n`);
          cleanup('poll_error');
        }
      }
    }, POLL_INTERVAL);

    // 客户端断开时清理
    request.raw.on('close', () => {
      cleanup('client_disconnect');
    });

    // Keep connection alive
    return reply;
  });

  // Get discussion history (all records from records/)
  fastify.get('/history', async (request, reply) => {
    try {
      console.log('Getting discussion history from records/');

      const { limit = 20, offset = 0 } = request.query;

      const files = await fs.readdir(recordsDir).catch(() => []);
      const mdFiles = {fileName: files.filter(f => f.endsWith('.md'))}?.fileName || [];

      // Sort by creation time (descending)
      const fileStats = await Promise.all(
        mdFiles.map(async fileName => {
          const filePath = path.join(recordsDir, fileName);
          const stats = await fs.stat(filePath);
          return { fileName, birthtimeMs: stats.birthtimeMs };
        })
      );

      fileStats.sort((a, b) => b.birthtimeMs - a.birthtimeMs);

      // Get page
      const total = fileStats.length;
      const start = parseInt(offset);
      const end = Math.min(start + parseInt(limit), total);
      const pageFiles = fileStats.slice(start, end);

      // Read file contents
      const records = await Promise.all(
        pageFiles.map(async ({ fileName }) => {
          const filePath = path.join(recordsDir, fileName);
          const content = await fs.readFile(filePath, 'utf8');

          // Extract session ID and topic from filename
          // Format: 2026-03-11_9625f9f6_哪些社会化的事项是反人性的.md
          const match = fileName.match(/^(\d{4}-\d{2}-\d{2})_([a-zA-Z0-9]+)_(.+?)\.md$/);
          const date = match ? match[1] : fileName.slice(0, 10);
          const sessionId = match ? match[2] : fileName.slice(0, 36);
          const topic = match ? match[3] : '未知主题';

          // Extract participating ghosts from content
          const ghostSet = new Set();
          
          // Known ghost names for validation
          const knownGhosts = ['Gally', 'gally', 'Motoko', 'motoko', 'K', 'k', 'Nova', 'nova', '诺瓦', '阳子', 'Yoko'];
          
          // Pattern: ## 第N轮 - GhostName
          const ghostRegex = /##?\s*第\d+轮\s*-\s*(.+)/g;
          let ghostMatch;
          while ((ghostMatch = ghostRegex.exec(content)) !== null) {
            let ghostName = ghostMatch[1].trim();
            
            // Skip invalid entries
            if (!ghostName || 
                ghostName === 'undefined' || 
                ghostName.includes('总结') || 
                ghostName.includes('共识') ||
                ghostName.length > 20) {  // Ghost names should be short
              continue;
            }
            
            // Only add if it looks like a valid ghost name (short and in known list or short enough)
            if (knownGhosts.some(g => ghostName.toLowerCase().includes(g.toLowerCase())) || 
                (ghostName.length <= 10 && !ghostName.includes('的'))) {
              ghostSet.add(ghostName);
            }
          }

          // Convert undefined to Ghost for display
          let ghosts = Array.from(ghostSet);
          if (ghosts.length === 0) {
            ghosts = ['Ghost'];  // Default fallback
          }

          // Count total rounds
          const roundMatches = content.match(/##?\s*第(\d+)轮/g);
          const totalRounds = roundMatches ? Math.max(...roundMatches.map(m => parseInt(m.match(/\d+/)[0]))) : 0;

          return {
            fileName,
            date,
            sessionId,
            topic,
            ghosts,
            totalRounds,
            // Don't send full content in list view, only send a preview
            preview: content.slice(0, 200).replace(/\n/g, ' ')
          };
        })
      );

      console.log('Discussion history retrieved successfully', { count: records.length });

      return reply.send({
        success: true,
        data: {
          records,
          pagination: {
            total,
            limitPer: parseInt(limit),
            offset: parseInt(offset),
            hasMore: end < total
          }
        }
      });
    } catch (error) {
      console.error('Failed to get discussion history', error);

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // Get single discussion record by filename
  fastify.get('/history/:filename', async (request, reply) => {
    try {
      const { filename } = request.params;

      // Security: prevent directory traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return reply.code(400).send({
          error: 'Invalid filename',
          message: 'Filename contains invalid characters'
        });
      }

      const filePath = path.join(recordsDir, filename);
      console.log(filePath)
      if (!(await fs.access(filePath).then(() => true).catch(() => false))) {
        return reply.code(404).send({
          error: 'File Not Found',
          message: 'The requested discussion record does not exist'
        });
      }

      const content = await fs.readFile(filePath, 'utf8');

      console.log('Discussion record retrieved successfully', { filename });

      return reply.send({
        success: true,
        data: {
          filename,
          content
        }
      });
    } catch (error) {
      console.error('Failed to get discussion record', error);

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });

  // Delete discussion record by filename
  fastify.delete('/history/:filename', async (request, reply) => {
    try {
      const { filename } = request.params;

      // Security: prevent directory traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return reply.code(400).send({
          error: 'Invalid filename',
          message: 'Discussion record filename contains invalid characters'
        });
      }

      const filePath = path.join(recordsDir, filename + '.md');

      if (!(await fs.access(filePath).then(() => true).catch(() => false))) {
        return reply.code(404).send({
          error: 'File Not Found',
          message: 'The requested discussion record does not exist'
        });
      }

      await fs.unlink(filePath);

      console.log('Discussion record deleted successfully', { filename });

      return reply.send({
        success: true,
        data: { deleted: true }
      });
    } catch (error) {
      console.error('Failed to delete discussion record', error);

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  });
}

module.exports = chatRoutes;
