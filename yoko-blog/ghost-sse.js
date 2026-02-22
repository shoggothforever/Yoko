console.log('ghost-sse.js (SSE版本) 开始加载');
const API_BASE = 'http://118.145.99.224:8080/api';
let currentSession = null;
let activeEventSource = null;

async function loadGhostsWithRetry(onLoading, onSuccess, onError) {
  const MAX_RETRY = 3;
  const url = `${API_BASE}/ghosts/active`;
  console.log('开始加载 Ghost，URL:', url);
  onLoading(true);
  
  for (let i = 0; i < MAX_RETRY; i++) {
    console.log(`尝试加载 Ghost(${i+1}/${MAX_RETRY})...`);
    try {
      const response = await fetch(`${API_BASE}/ghosts/active`);
      const result = await response.json();
      
      if (result.success) {
        const ghosts = result.data;
        console.log('从数据库加载Ghost成功:', ghosts);
        onLoading(false);
        onSuccess(ghosts);
        return ghosts;
      } else {
        throw new Error(result.message || 'API返回失败');
      }
    } catch (error) {
      console.error('加载Ghost失败:', error, 'URL:', url);
      if (i < MAX_RETRY - 1) {
        console.log(`重试 ${i+1}/${MAX_RETRY}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        onLoading(false);
        if (onError) onError(error);
        throw error;
      }
    }
  }
}

async function startDiscussionApi(topic, ghostIds, userId = 'web_user', maxRounds = 6) {
  const response = await fetch(`${API_BASE}/chat/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: topic,
      ghost_ids: ghostIds,
      user_id: userId,
      max_rounds: maxRounds,
      main_ghost: ghostIds[0]
    })
  });
  
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || '讨论启动失败');
  }
  
  currentSession = result.data;
  console.log('讨论会话创建成功:', currentSession);
  return currentSession;
}

function monitorDiscussionProgressSSE(sessionId, onNewMessage, onComplete, onProgress, onError) {
  console.log('启动SSE连接，session:', sessionId);
  
  // 清理之前的连接
  if (activeEventSource) {
    activeEventSource.close();
  }
  
  const eventSource = new EventSource(`${API_BASE}/chat/stream/${sessionId}`);
  activeEventSource = eventSource;
  
  // 监听消息
  eventSource.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      
      if (data.error) {
        console.error('SSEver端错误:', data.error);
        if (onError) onError(data.error);
        return;
      }
      
      if (data.status) {
        console.log('会话状态更新:', data.status);
        
        if (data.status.status === 'completed') {
          if (onProgress) onProgress(100, '讨论完成！');
          if (onComplete) onComplete({
            session: { status: 'completed' },
            consensus: data.status.consensus
          });
          eventSource.close();
        } else if (data.status.status === 'active') {
          if (onProgress) onProgress(10, '讨论进行中...');
        }
        return;
      }
      
      if (data.end) {
        console.log('SSE流结束');
        eventSource.close();
        return;
      }
      
      if (data) {
        console.log('新消息:', data);
        if (onNewMessage) onNewMessage(data);
        
        // 更新进度
        if (onProgress) {
          // 估算进度（消息数 / 轮次）
          const progress = Math.min(10 + (currentSession?.messages?.length || 0) * 15, 95);
          onProgress(progress, `讨论进行中...（第${data.round_number || '?'}轮）`);
        }
      }
    } catch (error) {
      console.error('SSE消息解析错误:', error);
    }
  });
  
  // 错误处理
  eventSource.addEventListener('error', (error) => {
    console.error('SSE连接错误:', error);
    if (onError) onError('SSE连接失败');
  });
  
  // 连接关闭
  eventSource.addEventListener('close', () => {
    console.log('SSE连接关闭');
    activeEventSource = null;
  });
}

function getCurrentSession() {
  return currentSession;
}

function clearCurrentSession() {
  currentSession = null;
  if (activeEventSource) {
    activeEventSource.close();
    activeEventSource = null;
  }
}

// 导出函数
window.loadGhostsWithRetry = loadGhostsWithRetry;
window.startDiscussionApi = startDiscussionApi;
window.monitorDiscussionProgressSSE = monitorDiscussionProgressSSE;
window.getCurrentSession = getCurrentSession;
window.clearCurrentSession = clearCurrentSession;

// 兼容：保持旧的轮询函数名
window.monitorDiscussionProgressApi = monitorDiscussionProgressSSE;

console.log('ghost-sse.js 加载完成，SSE函数已导出到 window');
