const flowService = require('../services/flow-service');
const db = require('../db');
const fs = require('fs').promises;
const path = require('path');
const recordsDir = path.join(__dirname, '../../records');

async function chatRoutes(fastify, options) {
  // Start new chat with
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

      const options = {
        maxRounds: max_rounds || 6,
        mainGhost: main_ghost
      };

      const result = await flowService.startFlow(topic, ghost_ids, user_id, options);

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

    // Check if session exists
    const sessionResult = await db.query(
      'SELECT id, status FROM chat_sessions WHERE id = $1',
      [id]
    );

    if (sessionResult.rows.length === 0) {
      reply.raw.write('event: error\ndata: {"error":"Session not found"}\n\n');
      return reply.raw.end();
    }

    const session = sessionResult.rows[0];

    // Send initial status
    reply.raw.write(`event: status\ndata: ${JSON.stringify({ status: session.status })}\n\n`);

    // Poll for updates (fallback if SSE not fully working)
    let lastMessageCount = 0;
    const checkInterval = setInterval(async () => {
      try {
        // Get latest message count
        const messageCountResult = await db.query(
          'SELECT COUNT(*) as count FROM chat_messages WHERE session_id = $1',
          [id]
        );

        const currentCount = parseInt(messageCountResult.rows[0].count);

        // Get session status
        const statusResult = await db.query(
          'SELECT status FROM chat_sessions WHERE id = $1',
          [id]
        );

        const currentStatus = statusResult.rows[0].status;

        // If new messages, send them
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
            reply.raw.write(`event: message\ndata: ${JSON.stringify(message)}\n\n`);
          });

          lastMessageCount = currentCount;
        }

        // If session completed, send final status and close
        if (currentStatus === 'completed') {
          const consensusResult = await db.query(
            'SELECT * FROM chat_consensus WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
            [id]
          );

          reply.raw.write(`event: status\ndata: ${JSON.stringify({ status: 'completed', consensus: consensusResult.rows[0] })}\n\n`);
          reply.raw.write('event: end\ndata: {}\n\n');
          reply.raw.end();
          clearInterval(checkInterval);
        }
      } catch (error) {
        console.error('SSE check error:', error);
        reply.raw.write('event: error\ndata: {"error":"' + error.message + '"}\n\n');
        clearInterval(checkInterval);
        reply.raw.end();
      }
    }, 2000); // Check every 2 seconds

    // Cleanup on disconnect
    request.raw.on('close', () => {
      console.log('SSE connection closed', { session_id: id });
      clearInterval(checkInterval);
    });

    // Keep connection alive
    return reply;
  });

  // Get discussion history (all records)
  fastify.get('/history', async (request, reply) => {
    try {
      console.log('Getting discussion history from records/');

      const { limit = 20, offset = 0 } = request.query;

      const files = await fs.readdir(recordsDir);
      const mdFiles = files.filter(f => f.endsWith('.md'));

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
          const match = fileName.match(/^(\d{4}-\d{2}-\d{2})_(.+?)_(.+?)\.md$/);
          const sessionId = match ? match[1] + '-' + match[2] : fileName.slice(0, 36);
          const date = match ? match[0] : fileName.slice(0, 10);
          const topic = match ? match[3] : '未知主题';

          return {
            fileName,
            date,
            sessionId,
            topic,
            content
          };
        })
      );

      console.log('Discussion history retrieved successfully', { count: records.length, });

      return reply.send({
        success: true,
        data: {
          records,
          pagination: {
            total,
            limitper: parseInt(limit),
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

      const filePath = path.join(recordsDir, filename + '.md');

      if (!(await fs.access(filePath)).then(() => true).catch(() => false)) {
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

      if (!(await fs.access(filePath)).then(() => true).catch(() => false)) {
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

module.exports = chatRoutes;
