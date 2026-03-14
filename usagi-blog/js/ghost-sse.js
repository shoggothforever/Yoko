console.log('ghost-sse.js (SSE版本 v2) 開始加载');
const API_BASE = 'http://118.145.99.224:8080/api';
let currentSession = null;
let activeEventSource = null;

async function loadGhostsWithRetry(onLoading, onSuccess, onError) {
  const MAX_RETRY = 3;
  const url = `${API_BASE}/ghosts/active`;
  onLoading(true);
  
  for (let i = 0; i < MAX_RETRY; i++) {
    try {
      const response = await fetch(`${API_BASE}/ghosts/active`);
      const result = await response.json();
      
      if (result.success) {
        const ghosts = result.data;
        onLoading(false);
        onSuccess(ghosts);
        return ghosts;
      } else {
        throw new Error(result.message || 'API返回失敗');
      }
    } catch (error) {
      if (i < MAX_RETRY - 1) {
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
    throw new Error(result.message || '討論開始失敗');
  }
  
  currentSession = result.data;
  return currentSession;
}

function monitorDiscussionProgressSSE(sessionId, onNewMessage, onComplete, onProgress, onError) {
  if (activeEventSource) {
    activeEventSource.close();
    activeEventSource = null;
  }
  
  let messageCount = 0;
  let retryCount = 0;
  const MAX_RETRIES = 3;
  let completed = false;
  
  function connect() {
    const eventSource = new EventSource(`${API_BASE}/chat/stream/${sessionId}`);
    activeEventSource = eventSource;
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        retryCount = 0;
        
        switch (data.type) {
          case 'status':
            if (data.status === 'active' && onProgress) {
              onProgress(5, 'Ghost思考中...');
            }
            break;
            
          case 'message':
            messageCount++;
            if (onNewMessage) onNewMessage(data);
            if (onProgress) {
              const maxRounds = currentSession?.max_rounds || 6;
              const percent = Math.min(10 + (messageCount / (maxRounds + 1)) * 85, 95);
              onProgress(percent, `${data.ghost_name || 'Ghost'} 発言中...`);
            }
            break;
            
          case 'completed':
            completed = true;
            eventSource.close();
            activeEventSource = null;
            if (onProgress) onProgress(100, '完了！');
            setTimeout(() => {
              if (onComplete) onComplete({
                session: { status: 'completed' },
                consensus: data.consensus
              });
            }, 800);
            break;
            
          case 'error':
            completed = true;
            eventSource.close();
            activeEventSource = null;
            if (messageCount > 0) {
              setTimeout(() => {
                if (onComplete) onComplete({ session: { status: 'partial' }, consensus: null });
              }, 2000);
            } else if (onError) {
              onError(data.error);
            }
            break;
        }
      } catch (error) {
        console.error('SSE解析エラー:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      if (completed) return;
      retryCount++;
      if (retryCount > MAX_RETRIES) {
        eventSource.close();
        activeEventSource = null;
        if (messageCount > 0) {
          pollFinalResult(sessionId, onComplete, onError);
        } else if (onError) {
          onError('接続中断');
        }
      }
    };
  }
  
  connect();
}

async function pollFinalResult(sessionId, onComplete, onError) {
  const MAX_POLL = 30;
  let pollCount = 0;
  
  const poll = async () => {
    try {
      const response = await fetch(`${API_BASE}/chat/session/${sessionId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const session = result.data.session;
        if (session.status === 'completed') {
          if (onComplete) onComplete({ session: { status: 'completed' }, consensus: result.data.consensus });
          return;
        }
        if (session.status === 'failed') {
          if (onComplete) onComplete({ session: { status: 'partial' }, consensus: null });
          return;
        }
      }
      
      pollCount++;
      if (pollCount < MAX_POLL) {
        setTimeout(poll, 2000);
      } else {
        if (onComplete) onComplete({ session: { status: 'partial' }, consensus: null });
      }
    } catch (error) {
      if (onError) onError('結果取得失敗');
    }
  };
  
  poll();
}

function getCurrentSession() { return currentSession; }
function clearCurrentSession() {
  currentSession = null;
  if (activeEventSource) { activeEventSource.close(); activeEventSource = null; }
}

window.loadGhostsWithRetry = loadGhostsWithRetry;
window.startDiscussionApi = startDiscussionApi;
window.monitorDiscussionProgressSSE = monitorDiscussionProgressSSE;
window.getCurrentSession = getCurrentSession;
window.clearCurrentSession = clearCurrentSession;
window.monitorDiscussionProgressApi = monitorDiscussionProgressSSE;
