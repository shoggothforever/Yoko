console.log('ghost-direct-chat.js v3 開始加载');
const API_BASE = 'http://118.145.99.224:8080/api';

// 聊天历史（仅内存，页面刷新即清空）
let chatHistory = [];

/**
 * 1v1 直聊 — 无状态，不写 DB，不创建 session
 * @param {string} ghostId
 * @param {string} message
 * @returns {Promise<{ghost_id, ghost_name, ghost_icon, content, elapsed_ms}>}
 */
async function directChat(ghostId, message) {
  const response = await fetch(`${API_BASE}/direct-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ghost_id: ghostId,
      message: message,
      history: chatHistory.slice(-20)
    })
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || '対話失敗');
  }

  // 追加到历史
  chatHistory.push({ role: 'user', content: message });
  chatHistory.push({ role: 'assistant', content: result.data.content });

  // 只保留最近 20 轮
  if (chatHistory.length > 40) {
    chatHistory = chatHistory.slice(-40);
  }

  return result.data;
}

function clearChatHistory() {
  chatHistory = [];
}

window.directChat = directChat;
window.clearChatHistory = clearChatHistory;
