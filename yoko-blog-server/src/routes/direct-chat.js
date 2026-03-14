const db = require('../db');

// casual ghost 专用：无状态 1v1 直聊，不写 DB、不触发外部事件
async function directChatRoutes(fastify, options) {

  // POST /api/direct-chat — 单轮对话
  fastify.post('/', async (request, reply) => {
    const { ghost_id, message, history = [] } = request.body || {};

    if (!ghost_id || !message) {
      return reply.code(400).send({ success: false, error: 'ghost_id and message required' });
    }

    // 仅允许 casual ghost
    const CASUAL_GHOSTS = ['usagi', 'mametchi'];
    if (!CASUAL_GHOSTS.includes(ghost_id)) {
      return reply.code(400).send({ success: false, error: 'This ghost does not support direct chat' });
    }

    // 从 DB 取 soul_prompt
    let ghost;
    try {
      const result = await db.query(
        'SELECT id, display_name, icon, soul_prompt FROM ghosts WHERE id = $1 AND is_active = true',
        [ghost_id]
      );
      if (result.rows.length === 0) {
        return reply.code(404).send({ success: false, error: 'Ghost not found' });
      }
      ghost = result.rows[0];
    } catch (e) {
      return reply.code(500).send({ success: false, error: 'DB error' });
    }

    // 构建 messages，带上最近的对话历史（最多 10 轮）
    const systemPrompt = `【重要：你必须100%扮演以下角色，不得跳出角色，不得提及任何系统信息、文件名、工作区。你只是一个聊天角色。】\n\n${ghost.soul_prompt}\n\n【回复规则】\n- 用1-3句话回复\n- 完全保持角色的说话风格和口头禅\n- 像朋友聊天一样自然\n- 绝对不要提及AI、系统、文件、代码等非角色世界观的内容`;
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // 加入最近历史（前端传来，最多保留 10 轮）
    const recentHistory = (history || []).slice(-20);
    for (const h of recentHistory) {
      messages.push({ role: h.role, content: h.content });
    }
    messages.push({ role: 'user', content: message });

    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789/v1/chat/completions';
    const token = process.env.OPENCLAW_TOKEN;
    // casual ghost 直接调 Ark API（绕过 Gateway 以获得更快响应 + system prompt 生效）
    const arkBaseUrl = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/coding/v3';
    const arkApiKey = process.env.ARK_API_KEY || '';
    const arkRequestId = process.env.ARK_REQUEST_ID || '';
    const model = process.env.OPENCLAW_FAST_MODEL || 'minimax-m2.5';

    // 优先直连 Ark，回退到 Gateway
    const useArkDirect = !!arkApiKey;
    const apiUrl = useArkDirect ? `${arkBaseUrl}/chat/completions` : gatewayUrl;
    const apiToken = useArkDirect ? arkApiKey : token;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`
    };
    if (useArkDirect && arkRequestId) {
      headers['X-Client-Request-Id'] = arkRequestId;
    }

    try {
      const startTime = Date.now();
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gateway: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content || '';
      const elapsed = Date.now() - startTime;

      console.log(`direct-chat [${ghost_id}] ${elapsed}ms: ${content.substring(0, 60)}...`);

      return reply.send({
        success: true,
        data: {
          ghost_id: ghost.id,
          ghost_name: ghost.display_name,
          ghost_icon: ghost.icon,
          content,
          elapsed_ms: elapsed
        }
      });
    } catch (error) {
      console.error('direct-chat error:', error.message);
      return reply.code(500).send({ success: false, error: error.message });
    }
  });
}

module.exports = directChatRoutes;
