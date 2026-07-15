const ApiClient = (function () {
  var cache = {};
  var retryCount = {};

  function getCacheKey(url) {
    return 'api_cache_' + url.replace(/[^a-zA-Z0-9]/g, '_');
  }

  function loadCache(url) {
    try {
      var key = getCacheKey(url);
      var cached = localStorage.getItem(key);
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed.expiry > Date.now()) {
          return parsed.data;
        }
        localStorage.removeItem(key);
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  function saveCache(url, data, ttlMs) {
    try {
      var key = getCacheKey(url);
      localStorage.setItem(key, JSON.stringify({ data: data, expiry: Date.now() + (ttlMs || 120000) }));
    } catch (e) { /* ignore */ }
  }

  function clearCache() {
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.startsWith('api_cache_')) localStorage.removeItem(k);
      });
      cache = {};
    } catch (e) { /* ignore */ }
  }

  function fetchWithTimeout(url, options, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); reject(new Error('Request timed out')); }, timeoutMs || 8000);
      fetch(url, { ...options, signal: controller.signal })
        .then(function (r) { clearTimeout(timer); resolve(r); })
        .catch(function (e) { clearTimeout(timer); reject(e); });
    });
  }

  function fetchWithRetry(url, options, maxRetries) {
    maxRetries = maxRetries || 2;
    var attempt = 0;

    function tryFetch() {
      attempt++;
      return fetchWithTimeout(url, options).then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        retryCount[url] = 0;
        return response.json();
      }).catch(function (err) {
        if (attempt <= maxRetries) {
          return new Promise(function (resolve) {
            setTimeout(function () { resolve(tryFetch()); }, 1000 * attempt);
          });
        }
        throw err;
      });
    }

    return tryFetch();
  }

  function fetchUsers() {
    var url = 'https://dummyjson.com/users?limit=20&select=firstName,lastName,email,company,role';

    var cached = loadCache(url);
    if (cached) return Promise.resolve(cached);

    return fetchWithRetry(url).then(function (data) {
      var users = (data.users || []).map(function (u, i) {
        var statuses = ['active', 'active', 'active', 'inactive', 'suspended'];
        var plans = ['Enterprise', 'Pro', 'Pro', 'Free', 'Free'];
        return {
          id: 'api-u' + u.id,
          name: u.firstName + ' ' + u.lastName,
          email: u.email,
          role: ['Admin', 'Editor', 'Viewer'][i % 3],
          status: statuses[i % statuses.length],
          plan: plans[i % plans.length],
          joined: new Date(Date.now() - Math.random() * 365 * 86400000).toISOString().slice(0, 10),
          revenue: Math.round(Math.random() * 5000),
          apiSource: true
        };
      });
      saveCache(url, users, 300000);
      return users;
    });
  }

  function fetchTransactions() {
    var url = 'https://dummyjson.com/products?limit=20';

    var cached = loadCache(url);
    if (cached) return Promise.resolve(cached);

    return fetchWithRetry(url).then(function (data) {
      var methods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Wire Transfer', 'ACH'];
      var statuses = ['completed', 'completed', 'completed', 'pending', 'failed', 'refunded'];
      var transactions = (data.products || []).map(function (p, i) {
        return {
          id: 'api-t' + p.id,
          invoice: 'INV-' + String(2026000 + parseInt(p.id)).slice(-7),
          customer: p.title,
          email: p.brand ? p.brand.toLowerCase().replace(/\s+/g, '') + '@example.com' : 'vendor@example.com',
          amount: Math.round(p.price * (p.stock !== undefined ? p.stock : 10) * (0.5 + Math.random())),
          status: statuses[i % statuses.length],
          date: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString().slice(0, 10),
          method: methods[i % methods.length],
          apiSource: true
        };
      });
      saveCache(url, transactions, 300000);
      return transactions;
    });
  }

  function fetchStats() {
    var url = 'https://dummyjson.com/users?limit=0&select=id';

    var cached = loadCache(url);
    if (cached) return Promise.resolve(cached);

    return fetchWithRetry(url).then(function (data) {
      var totalUsers = data.total || 100;
      var stats = {
        totalUsers: totalUsers,
        activeUsers: Math.round(totalUsers * 0.72),
        totalRevenue: Math.round(Math.random() * 500000 + 200000),
        avgOrderValue: Math.round(Math.random() * 200 + 50),
        conversionRate: (Math.random() * 5 + 1.5).toFixed(1)
      };
      saveCache(url, stats, 120000);
      return stats;
    });
  }

  function isOnline() {
    return navigator.onLine;
  }

  return {
    fetchUsers: fetchUsers,
    fetchTransactions: fetchTransactions,
    fetchStats: fetchStats,
    clearCache: clearCache,
    isOnline: isOnline
  };
})();
