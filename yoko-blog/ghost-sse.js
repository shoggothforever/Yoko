console.log('ghost-sse.js (SSE版本 v2) 开始加载');
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

// 启动讨论 — 现在是异步的，POST 立即返回 session_id
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

// SSE 监听 — 后端现在统一用 data-only 格式，前端通过 type 字段区分
function monitorDiscussionProgressSSE(sessionId, onNewMessage, onComplete, onProgress, onError) {
  console.log('启动SSE连接，session:', sessionId);
  
  // 清理之前的连接
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
    
    // 统一在 onmessage 中处理所有事件（后端发的是 data-only，无 event: 字段）
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        retryCount = 0;  // 成功收到消息，重置重试计数
        
        switch (data.type) {
          case 'status':
            console.log('会话状态:', data.status);
            if (data.status === 'active') {
              if (onProgress) onProgress(5, 'Ghost们正在思考...');
            }
            break;
            
          case 'message':
            messageCount++;
            console.log(`新消息 #${messageCount}:`, data.ghost_name, `(第${data.round_number}轮)`);
            if (onNewMessage) onNewMessage(data);
            
            // 根据消息数量估算进度
            if (onProgress) {
              const maxRounds = currentSession?.max_rounds || 6;
              const estimatedTotal = maxRounds + 1;  // +1 for summary
              const percent = Math.min(10 + (messageCount / estimatedTotal) * 85, 95);
              const roundText = data.round_number ? `第${data.round_number}轮` : '';
              onProgress(percent, `${data.ghost_name || 'Ghost'} 正在发言... ${roundText}`);
            }
            break;
            
          case 'completed':
            console.log('讨论完成，关闭SSE连接');
            completed = true;
            eventSource.close();
            activeEventSource = null;
            
            if (onProgress) onProgress(100, '讨论完成！正在生成总结...');
            
            // 稍微延迟一下再显示结果，让用户看到100%
            setTimeout(() => {
              if (onComplete) onComplete({
                session: { status: 'completed' },
                consensus: data.consensus
              });
            }, 800);
            break;
            
          case 'error':
            console.error('服务端错误:', data.error);
            completed = true;
            eventSource.close();
            activeEventSource = null;
            
            // 如果已有消息，不算完全失败
            if (messageCount > 0) {
              if (onProgress) onProgress(undefined, '⚠ ' + (data.error || '出了点小问题'));
              setTimeout(() => {
                if (onComplete) onComplete({
                  session: { status: 'partial' },
                  consensus: null
                });
              }, 2000);
            } else if (onError) {
              onError(data.error);
            }
            break;
            
          default:
            console.log('未知消息类型:', data.type, data);
        }
      } catch (error) {
        console.error('SSE消息解析错误:', error, '原始数据:', event.data);
      }
    };
    
    // 连接错误 — SSE 会自动重连，但我们需要限制次数
    eventSource.onerror = (error) => {
      console.warn('SSE连接异常:', error);
      
      if (completed) return;  // 已完成，忽略
      
      retryCount++;
      
      if (retryCount <= MAX_RETRIES) {
        console.log(`SSE 自动重连 ${retryCount}/${MAX_RETRIES}...`);
        if (onProgress) onProgress(undefined, `连接中断，正在重连 (${retryCount}/${MAX_RETRIES})...`);
        // EventSource 会自动重连，不需要手动处理
      } else {
        console.error('SSE 重连次数耗尽');
        eventSource.close();
        activeEventSource = null;
        
        // 如果已有消息，尝试用轮询取回最终结果
        if (messageCount > 0) {
          if (onProgress) onProgress(undefined, '连接中断，正在获取最终结果...');
          pollFinalResult(sessionId, onComplete, onError);
        } else if (onError) {
          onError('连接中断，请刷新页面重试');
        }
      }
    };
  }
  
  connect();
}

// 轮询获取最终结果（SSE断开后的降级方案）
async function pollFinalResult(sessionId, onComplete, onError) {
  const MAX_POLL = 30;  // 最多轮询60秒
  let pollCount = 0;
  
  const poll = async () => {
    try {
      const response = await fetch(`${API_BASE}/chat/session/${sessionId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const session = result.data.session;
        
        if (session.status === 'completed') {
          if (onComplete) onComplete({
            session: { status: 'completed' },
            consensus: result.data.consensus
          });
          return;
        }
        
        if (session.status === 'failed') {
          if (onComplete) onComplete({
            session: { status: 'partial' },
            consensus: null
          });
          return;
        }
      }
      
      pollCount++;
      if (pollCount < MAX_POLL) {
        setTimeout(poll, 2000);
      } else {
        // 超时了，但可能后台还在运行
        if (onComplete) onComplete({
          session: { status: 'partial' },
          consensus: null
        });
      }
    } catch (error) {
      console.error('轮询失败:', error);
      if (onError) onError('获取结果失败，请稍后在讨论历史中查看');
    }
  };
  
  poll();
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

console.log('ghost-sse.js v2 加载完成');
