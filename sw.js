const CACHE_NAME = 'rqrunning-mobile-v3';
const STATIC_CACHE = 'rqrunning-static-v3';
const DYNAMIC_CACHE = 'rqrunning-dynamic-v3';

const STATIC_ASSETS = [
  './',
  './index.html',
  './assets/styles.css',
  './assets/app.js',
  './manifest.webmanifest',
  './favicon.svg',
  './apple-touch-icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
        .map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const { url } = event.request;
  const isStatic = STATIC_ASSETS.some(asset => url.includes(asset));

  if (isStatic) {
    // Cache First for static assets
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          return caches.open(STATIC_CACHE).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        }).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
  } else {
    // Network First for dynamic content
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request))
    );
  }
});
