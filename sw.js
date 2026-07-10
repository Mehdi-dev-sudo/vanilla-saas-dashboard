const CACHE_NAME = 'vanilla-saas-dashboard-v4';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css?v=5',
  './js/core/utils.js?v=1',
  './js/core/router.js?v=1',
  './js/core/pluginSystem.js?v=1',
  './js/data/api.js?v=1',
  './js/data/data.js?v=1',
  './js/data/history.js?v=1',
  './js/data/activity.js?v=1',
  './js/components/toast.js?v=1',
  './js/components/modal.js?v=1',
  './js/components/sidebar.js?v=1',
  './js/components/theme.js?v=1',
  './js/components/auth.js?v=1',
  './js/components/charts.js?v=1',
  './js/components/commandPalette.js?v=1',
  './js/components/contextMenu.js?v=1',
  './js/components/devConsole.js?v=1',
  './js/components/animations.js?v=1',
  './js/components/skeleton.js?v=1',
  './js/components/virtualScroll.js?v=1',
  './js/plugins/perfMonitor.js?v=1',
  './js/pages/dashboard.js?v=1',
  './js/pages/analytics.js?v=1',
  './js/pages/users.js?v=1',
  './js/pages/transactions.js?v=1',
  './js/pages/settings.js?v=1',
  './js/pages/support.js?v=1',
  './js/pages/error.js?v=1',
  './js/app.js?v=1'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.map(function (n) {
        if (n !== CACHE_NAME) return caches.delete(n);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var requestUrl = new URL(event.request.url);

  // For HTML, use network-first: try network, fall back to cache
  if (requestUrl.pathname === '/' || requestUrl.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        return response;
      }).catch(function () {
        return caches.match(event.request).then(function (cached) {
          return cached || caches.match('./index.html');
        });
      })
    );
    return;
  }

  // For API/XHR requests, use network-only (never cache dynamic data)
  if (requestUrl.pathname.includes('/api/')) {
    event.respondWith(fetch(event.request).catch(function () {
      return new Response(JSON.stringify({ error: 'offline' }), {
        status: 503, headers: { 'Content-Type': 'application/json' }
      });
    }));
    return;
  }

  // For all other assets, use cache-first with network update
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        }
        return response;
      }).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
