// Ghost API 服务
console.log('ghost.js 开始加载');
const API_BASE = '/api';

let currentSession = null;

/**
 * 加载活跃的 Ghost 列表（带重试机制）
 * @param {Function} onLoading - 加载状态回调
 * @param {Function} onSuccess - 成功回调，接收 Ghost 数据
 * @param {Function} onError - 错误回调
 */
async function loadGhostsWithRetry(onLoading, onSuccess, onError) {
    const MAX_RETRY = 3;
    const url = `${API_BASE}/ghosts/active`;

    console.log('开始加载 Ghost，URL:', url);
    onLoading(true);

    for (let i = 0; i < MAX_RETRY; i++) {
        console.log(`尝试加载 Ghost (${i + 1}/${MAX_RETRY})...`);
        try {
            const response = await fetch(`${API_BASE}/ghosts/active`);
            const result = await response.json();

            if (result.success) {
                const ghosts = result.data;
                console.log('从数据库加载Ghost成功:', ghosts);
                onLoading(false);  // 成功后关闭加载状态
                onSuccess(ghosts);
                return ghosts;
            } else {
                throw new Error(result.message || 'API返回失败');
            }
        } catch (error) {
            console.error('加载Ghost失败:', error, 'URL:', url);
            if (i < MAX_RETRY - 1) {
                console.log(`重试 ${i + 1}/${MAX_RETRY}...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                onLoading(false);
                if (onError) onError(error);
                throw error;
            }
        }
    }
}

/**
 * 启动Ghost讨论（API版本）
 * @param {string} topic - 讨论话题
 * @param {Array} ghostIds - 参与讨论的Ghost ID列表
 * @param {string} userId - 用户ID（默认为'web_user'）
 * @param {number} maxRounds - 最大讨论轮数（默认为6）
 */
async function startDiscussionApi(topic, ghostIds, userId = 'web_user', maxRounds = 6) {
    const response = await fetch(`${API_BASE}/chat/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
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

/**
 * 监控讨论进度（API版本，使用轮询）
 * @param {string} sessionId - 会话ID
 * @param {Function} onNewMessage - 新消息回调
 * @param {Function} onComplete - 讨论完成回调
 * @param {Function} onProgress - 进度回调
 */
async function monitorDiscussionProgressApi(sessionId, onNewMessage, onComplete, onProgress) {
    let lastMessageCount = 0;
    const maxAttempts = 120;
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const response = await fetch(`${API_BASE}/chat/session/${sessionId}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || '获取会话失败');
            }

            const messages = result.data.messages || [];
            const session = result.data.session;

            if (messages.length > lastMessageCount) {
                const newMessages = messages.slice(lastMessageCount);
                for (const message of newMessages) {
                    if (onNewMessage) onNewMessage(message);
                }
                lastMessageCount = messages.length;

                if (onProgress) {
                    const progress = 10 + Math.min((lastMessageCount / 6) * 80, 80);
                    onProgress(progress, `正在讨论...（第${lastMessageCount}轮）`);
                }
            }

            if (session && session.status === 'completed') {
                if (onProgress) onProgress(100, '讨论完成！');
                if (onComplete) onComplete(result.data);
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        } catch (error) {
            console.error('获取讨论进度失败:', error);
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
        }
    }

    return currentSession;
}

function getCurrentSession() {
    return currentSession;
}

function clearCurrentSession() {
    currentSession = null;
}

// 导出函数到 window 对象
window.loadGhostsWithRetry = loadGhostsWithRetry;
window.startDiscussionApi = startDiscussionApi;
window.monitorDiscussionProgressApi = monitorDiscussionProgressApi;
window.getCurrentSession = getCurrentSession;
window.clearCurrentSession = clearCurrentSession;

console.log('ghost.js 加载完成，函数已导出到 window');
