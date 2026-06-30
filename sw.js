var CACHE_NAME = 'saas-dashboard-v2';
var URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './js/core/utils.js',
  './js/core/router.js',
  './js/core/pluginSystem.js',
  './js/data/api.js',
  './js/data/data.js',
  './js/data/history.js',
  './js/data/activity.js',
  './js/components/toast.js',
  './js/components/modal.js',
  './js/components/sidebar.js',
  './js/components/theme.js',
  './js/components/auth.js',
  './js/components/charts.js',
  './js/components/commandPalette.js',
  './js/components/contextMenu.js',
  './js/components/devConsole.js',
  './js/components/animations.js',
  './js/components/skeleton.js',
  './js/components/virtualScroll.js',
  './js/plugins/perfMonitor.js',
  './js/pages/dashboard.js',
  './js/pages/analytics.js',
  './js/pages/users.js',
  './js/pages/transactions.js',
  './js/pages/settings.js',
  './js/pages/support.js',
  './js/pages/error.js',
  './js/app.js'
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
        return caches.match(event.request);
      })
    );
    return;
  }

  // For all other assets, use cache-first with network update
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var fetchPromise = fetch(event.request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        }
        return response;
      }).catch(function () { return cached; });
      return cached || fetchPromise;
    })
  );
});
