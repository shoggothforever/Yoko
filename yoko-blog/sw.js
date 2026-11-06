/** Service worker: fresh blog content with an offline fallback. */
const CACHE_PREFIX = 'yoko-blog-';
const CACHE_NAME = `${CACHE_PREFIX}v6`;
const CACHE_VERSION = '6.0.0';
const SCOPE_URL = new URL(self.registration.scope);
const OFFLINE_URL = new URL('offline.html', SCOPE_URL).href;

const ASSETS_TO_CACHE = [
  'style.min.css',
  'index-styles.min.css',
  'css/cyberpunk-effects.css',
  'css/blog-article-template.css',
  'ghost-chatroom.min.css',
  'ghost-chatroom-improvements.css',
  'js/cyberpunk-vue.js',
  'js/header-component.js',
  'js/footer-component.js',
  'js/article-enhancements.js',
  'js/cyberpunk-effects.js',
  'ghost.min.js',
  'script.min.js',
  'ghost.js',
  'ghost-sse.js',
  'blog-posts-data.js',
  'manifest.json',
  'offline.html',
  'categories.html',
  'archive.html',
  'tags.html',
  'notes.html',
  'notes-data.js',
  'public/images/加里.webp'
];

const performanceLog = [];
const MAX_PERF_LOGS = 50;
let cacheHits = 0;
let cacheMisses = 0;

function logPerformance(type, duration, success) {
  if (performanceLog.length >= MAX_PERF_LOGS) performanceLog.shift();
  performanceLog.push({ timestamp: Date.now(), type, duration, success });
}

function isBlogRequest(request) {
  const url = new URL(request.url);
  return request.method === 'GET' && url.origin === SCOPE_URL.origin &&
    url.pathname.startsWith(SCOPE_URL.pathname);
}

function isContentRequest(request) {
  const path = new URL(request.url).pathname;
  // Scripts/styles have stable filenames too, so always revalidate updates.
  return request.mode === 'navigate' || /\.(?:html|xml|json|js|css)$/.test(path) ||
    path.endsWith('/');
}

async function storeResponse(cache, request, response) {
  // Never store errors, partial/opaque responses, or cross-origin redirects.
  if (response.status !== 200 || response.type === 'opaque' ||
      (response.url && new URL(response.url).origin !== SCOPE_URL.origin) ||
      /\bno-store\b/i.test(response.headers.get('Cache-Control') || '')) return;
  try {
    await cache.put(request, response.clone());
  } catch (_) {
    // Storage quotas or a non-cacheable response must not hide fresh content.
  }
}

async function precacheAssets() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(ASSETS_TO_CACHE.map(async (asset) => {
    const request = new Request(new URL(asset, SCOPE_URL), { cache: 'reload' });
    if (!isBlogRequest(request)) return;
    try {
      const response = await fetch(request);
      await storeResponse(cache, request, response);
    } catch (_) {
      // One missing optional asset must not prevent the worker from updating.
    }
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheAssets().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(
    names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name))
  )).then(() => self.clients.claim()));
});

async function offlineResponse(cache, request, networkResponse) {
  const cached = await cache.match(request);
  if (cached) {
    cacheHits++;
    logPerformance('offline-cache', 0, true);
    return cached;
  }
  if (networkResponse) return networkResponse;
  if (request.mode === 'navigate') {
    const offline = await cache.match(OFFLINE_URL);
    if (offline) return offline;
  }
  return Response.error();
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const start = performance.now();
  cacheMisses++;
  try {
    // Revalidate the browser's HTTP cache as well as bypassing the SW cache.
    const response = await fetch(new Request(request, { cache: 'no-cache' }));
    logPerformance('network', performance.now() - start, response.ok);
    if (response.status >= 500) return offlineResponse(cache, request, response);
    await storeResponse(cache, request, response);
    return response;
  } catch (_) {
    logPerformance('network', performance.now() - start, false);
    return offlineResponse(cache, request);
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) {
    cacheHits++;
    logPerformance('cache-hit', 0, true);
    return cached;
  }
  return networkFirst(request);
}

self.addEventListener('fetch', (event) => {
  if (!isBlogRequest(event.request)) return;
  event.respondWith(isContentRequest(event.request)
    ? networkFirst(event.request)
    : cacheFirst(event.request));
});

self.addEventListener('message', (event) => {
  const type = event.data && event.data.type;
  const reply = (message) => {
    if (event.ports && event.ports[0]) event.ports[0].postMessage(message);
    else if (event.source && event.source.postMessage) event.source.postMessage(message);
  };
  if (type === 'get-stats') {
    const total = cacheHits + cacheMisses;
    reply({
      hits: cacheHits, misses: cacheMisses, total,
      hitRate: total ? (cacheHits / total * 100).toFixed(1) : 0,
      cacheVersion: CACHE_VERSION, performanceLog
    });
  } else if (type === 'clear-cache') {
    event.waitUntil(caches.delete(CACHE_NAME).then(() => {
      cacheHits = 0;
      cacheMisses = 0;
      performanceLog.length = 0;
      reply({ success: true });
    }).catch(() => reply({ success: false })));
  } else if (type === 'precache') {
    event.waitUntil(precacheAssets().then(async () => {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      const sizes = await Promise.all(keys.map(async (key) => {
        const response = await cache.match(key);
        return response ? (await response.blob()).size : 0;
      }));
      reply({ success: true, size: sizes.reduce((sum, size) => sum + size, 0), filesCached: keys.length });
    }).catch(() => reply({ success: false })));
  }
});
