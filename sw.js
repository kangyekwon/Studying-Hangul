// Service Worker 버전 관리
const CACHE_VERSION = 'v12';
const CACHE_NAME = `kpop-korean-${CACHE_VERSION}`;
const CACHE_NAME_STATIC = `${CACHE_NAME}-static`;
const CACHE_NAME_DYNAMIC = `${CACHE_NAME}-dynamic`;
const CACHE_NAME_CDN = `${CACHE_NAME}-cdn`;

// 정적 리소스 캐시 목록 (앱 셸)
const STATIC_CACHE_URLS = [
  './',
  './index.html',
  './styles.css', // 새로 추가된 CSS 파일
  './manifest.json'
];

// JavaScript 모듈 캐시 목록
const JS_CACHE_URLS = [
  './connection-map.js',
  './content-data.js',
  './new-modes.js',
  './system-features.js',
  './external-integrations.js',
  './more-content.js',
  './more-modes.js',
  './bonus-content.js',
  './bonus-modes.js',
  './smart-analytics.js',
  './game-engine.js',
  './mini-games.js',
  './social-features.js',
  './ui-enhancements.js',
  './logger.js'
];

// CDN 리소스 (동적 캐싱)
const CDN_PATTERNS = [
  /^https:\/\/cdn\.jsdelivr\.net\//,
  /^https:\/\/fonts\.googleapis\.com\//,
  /^https:\/\/fonts\.gstatic\.com\//
];

// 캐시 크기 제한
const CACHE_SIZE_LIMIT = {
  [CACHE_NAME_DYNAMIC]: 50,
  [CACHE_NAME_CDN]: 30
};

// 캐시 크기 제한 함수
const limitCacheSize = (cacheName, maxItems) => {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxItems));
      }
    });
  });
};

// Install 이벤트: 정적 리소스 사전 캐싱
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...', CACHE_VERSION);

  event.waitUntil(
    Promise.all([
      // 정적 리소스 캐시
      caches.open(CACHE_NAME_STATIC).then(cache => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      }),
      // JavaScript 모듈 캐시
      caches.open(CACHE_NAME_DYNAMIC).then(cache => {
        console.log('[SW] Caching JavaScript modules');
        return cache.addAll(JS_CACHE_URLS);
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting(); // 즉시 활성화
    })
  );
});

// Activate 이벤트: 이전 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...', CACHE_VERSION);

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('kpop-korean-') && !name.includes(CACHE_VERSION))
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim(); // 즉시 제어 획득
    })
  );
});

// Fetch 이벤트: 네트워크 요청 처리
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // POST 요청은 캐싱하지 않음
  if (request.method !== 'GET') {
    return;
  }

  // CDN 리소스 처리
  if (CDN_PATTERNS.some(pattern => pattern.test(request.url))) {
    event.respondWith(
      cacheFirstStrategy(request, CACHE_NAME_CDN)
    );
    return;
  }

  // 정적 리소스 처리 (앱 셸)
  if (STATIC_CACHE_URLS.includes(url.pathname) || url.pathname === '/') {
    event.respondWith(
      networkFirstStrategy(request, CACHE_NAME_STATIC)
    );
    return;
  }

  // JavaScript 모듈 처리
  if (JS_CACHE_URLS.some(js => url.pathname.endsWith(js.replace('./', '')))) {
    event.respondWith(
      networkFirstStrategy(request, CACHE_NAME_DYNAMIC)
    );
    return;
  }

  // 기타 리소스: 네트워크 우선, 캐시 폴백
  event.respondWith(
    networkFirstStrategy(request, CACHE_NAME_DYNAMIC)
  );
});

// 캐싱 전략: Cache First (CDN 리소스용)
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Cache hit:', request.url);
      return cachedResponse;
    }

    console.log('[SW] Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      limitCacheSize(cacheName, CACHE_SIZE_LIMIT[cacheName] || 50);
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    // 오프라인 폴백
    return caches.match('./index.html');
  }
}

// 캐싱 전략: Network First (앱 리소스용)
async function networkFirstStrategy(request, cacheName) {
  try {
    console.log('[SW] Network first:', request.url);
    const networkResponse = await fetch(request, { cache: 'no-cache' });

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      limitCacheSize(cacheName, CACHE_SIZE_LIMIT[cacheName] || 50);
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, using cache:', request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // 최종 폴백: index.html
    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }

    throw error;
  }
}

// 메시지 이벤트: 클라이언트와 통신
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

// Background Sync (선택적)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(
      // 백그라운드 동기화 로직
      Promise.resolve()
    );
  }
});

console.log('[SW] Service Worker loaded:', CACHE_VERSION);
