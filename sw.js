var CACHE_NAME = 'saas-dashboard-v1';
var URLS_TO_CACHE = [
  './',
  './index.html',
  './css/main.css',
  './js/core/utils.js',
  './js/core/router.js',
  './js/data/api.js',
  './js/data/data.js',
  './js/components/toast.js',
  './js/components/modal.js',
  './js/components/sidebar.js',
  './js/components/theme.js',
  './js/components/auth.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); }));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request).catch(function () {
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
