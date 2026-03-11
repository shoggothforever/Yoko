/**
 * Service Worker - 实现静态资源缓存和离线支持
 * 
 * 功能：
 * 1. 缓存静态资源（CSS、JS、图片）
 * 2. 离线优先策略
 * 3. 动态资源更新
 * 4. 性能监控
 */

const CACHE_NAME = 'yoko-blog-v1';
const CACHE_VERSION = '1.0.0';
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// 需要缓存的静态资源
const ASSETS_TO_CACHE = [
  // CSS文件
  'style.min.css',
  'index-styles.min.css',
  'css/cyberpunk-effects.css',
  'ghost-chatroom.min.css',
  'ghost-chatroom-improvements.css',
  
  // JS文件
  'js/cyberpunk-vue.js',
  'js/header-component.js',
  'js/footer-component.js',
  'js/cyberpunk-effects.js',
  'ghost.min.js',
  'script.min.js',
  'ghost.js',
  'ghost-sse.js',
  
  // 图片资源
  'public/images/加里.webp'
];

// 性能监控
const performanceLog = [];
const MAX_PERF_LOGS = 50;

// 监控缓存命中率
let cacheHits = 0;
let cacheMisses = 0;

// 记录性能指标
function logPerformance(type, duration, success) {
  if (performanceLog.length >= MAX_PERF_LOGS) {
    performanceLog.shift();
  }
  
  performanceLog.push({
    timestamp: Date.now(),
    type,
    duration,
    success
  });
  
  // 发送性能数据到主线程
  clients.forEach(client => {
    client.postMessage({
      type: 'performance',
      data: {
        hits: cacheHits,
        misses: cacheMisses,
        hitRate: cacheHits + cacheMisses > 0 ? (cacheHits / (cacheHits + cacheMisses) * 100).toFixed(1) : 0
      }
    });
  });
}

const clients = [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE.map(asset => new Request(asset, {
        cache: 'reload',
        headers: new Headers({
          'Cache-Control': 'public, max-age=31536000'
        })
      })));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE.map(asset => new Request(asset)));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 缓存命中
      if (cachedResponse) {
        cacheHits++;
        logPerformance('cache-hit', 0, true);
        return cachedResponse;
      }
      
      // 缓存未命中
      cacheMisses++;
      const startTime = performance.now();
      
      return fetch(event.request.clone()).then((response) => {
        const duration = performance.now() - startTime;
        
        // 只缓存成功的响应
        if (response.ok) {
          const responseClone = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        
        logPerformance('cache-miss', duration, response.ok);
        return response;
      });
    })
  );
});

// 性能统计端点
self.addEventListener('message', (event) => {
  if (event.data.type === 'get-stats') {
    const total = cacheHits + cacheMisses;
    
    event.ports[0].postMessage({
      hits: cacheHits,
      misses: cacheMisses,
      total: total,
      hitRate: total > 0 ? (cacheHits / total * 100).toFixed(1) : 0,
      cacheVersion: CACHE_VERSION,
      performanceLog
    });
  }
  
  if (event.data.type === 'clear-cache') {
    caches.delete(CACHE_NAME).then(() => {
      cacheHits = 0;
      cacheMisses = 0;
      performanceLog.length = 0;
      event.ports[0].postMessage({ success: true });
    });
  }
  
  if (event.data.type === 'precache') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE.map(asset => new Request(asset, {
          cache: 'reload',
          headers: new Headers({
            'Cache-Control': 'public, max-age=31536000'
          })
        })));
      }).then(() => {
        // 计算缓存大小
        return caches.open(CACHE_NAME).then(openedCache => {
          return openedCache.keys().then(keys => {
            return Promise.all(keys.map(key => {
              return openedCache.match(key).then(response => {
                if (response) {
                  return response.blob().then(b => b.size);
                }
                return 0;
              });
            })).then(sizes => {
              const totalSize = sizes.reduce((sum, size) => sum + size, 0);
              event.ports[0].postMessage({ 
                success: true, 
                size: totalSize,
                filesCached: keys.length 
              });
            });
          });
        });
      })
    );
  }
});

// 连接管理
self.addEventListener('connect', (event) => {
  clients.push(event.ports[0]);
  
  event.ports[0].onmessage = () => {
    // 处理来自客户端的消息
  };
  
  event.ports[0].start();
});

self.addEventListener('disconnect', (event) => {
  const index = clients.indexOf(event.ports[0]);
  if (index > -1) {
    clients.splice(index, 1);
  }
});
