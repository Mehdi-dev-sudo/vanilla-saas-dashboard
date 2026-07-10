var DevConsole = (function () {
  var isOpen = false;
  var fps = 0;
  var frames = 0;
  var lastTime = performance.now();
  var overlay = null;
  var fpsInterval = null;
  var metricsInterval = null;
  var fpsRafId = null;

  function init() {
    var div = document.createElement('div');
    div.id = 'devConsole';
    div.className = 'dev-console';
    div.innerHTML = [
      '<div class="dev-console__header">',
        '<span class="dev-console__title">Developer Console</span>',
        '<button class="dev-console__close" id="devConsoleClose">&times;</button>',
      '</div>',
      '<div class="dev-console__body">',
        '<div class="dev-console__grid">',
          '<div class="dev-console__metric"><div class="dev-console__metric-value" id="devFps">0</div><div class="dev-console__metric-label">FPS</div></div>',
          '<div class="dev-console__metric"><div class="dev-console__metric-value" id="devMemory">0 MB</div><div class="dev-console__metric-label">Memory</div></div>',
          '<div class="dev-console__metric"><div class="dev-console__metric-value" id="devDomNodes">0</div><div class="dev-console__metric-label">DOM Nodes</div></div>',
          '<div class="dev-console__metric"><div class="dev-console__metric-value" id="devStorage">0 KB</div><div class="dev-console__metric-label">Storage</div></div>',
        '</div>',
        '<div class="dev-console__details">',
          '<div class="dev-console__row"><span>Route</span><span id="devRoute">—</span></div>',
          '<div class="dev-console__row"><span>Theme</span><span id="devTheme">—</span></div>',
          '<div class="dev-console__row"><span>Auth</span><span id="devAuth">—</span></div>',
          '<div class="dev-console__row"><span>Users</span><span id="devUsers">0</span></div>',
          '<div class="dev-console__row"><span>Transactions</span><span id="devTx">0</span></div>',
          '<div class="dev-console__row"><span>API Status</span><span id="devApi">—</span></div>',
          '<div class="dev-console__row"><span>Settings</span><span id="devSettings">—</span></div>',
        '</div>',
        '<div class="dev-console__actions">',
          '<button class="btn btn--sm btn--secondary" id="devClearCache">Clear Cache</button>',
          '<button class="btn btn--sm btn--secondary" id="devClearStorage">Clear Storage</button>',
          '<button class="btn btn--sm btn--danger" id="devResetData">Reset All Data</button>',
        '</div>',
      '</div>'
    ].join('\n');
    document.body.appendChild(div);
    overlay = div;

    document.getElementById('devConsoleClose').addEventListener('click', close);
    document.getElementById('devClearCache').addEventListener('click', function () { ApiClient.clearCache(); ToastSystem.success('API cache cleared'); updateMetrics(); });
    document.getElementById('devClearStorage').addEventListener('click', function () { if (confirm('Clear all localStorage?')) { localStorage.clear(); ToastSystem.success('Storage cleared'); updateMetrics(); } });
    document.getElementById('devResetData').addEventListener('click', function () { if (confirm('Reset all data to defaults?')) { localStorage.removeItem('saas_dashboard_state'); localStorage.removeItem('saas_activity_log'); window.location.reload(); } });

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggle();
      }
    });
  }

  function toggle() { isOpen ? close() : open(); }

  function open() {
    isOpen = true;
    overlay.classList.add('open');
    metricsInterval = setInterval(updateMetrics, 1000);
    updateMetrics();
    startFpsCounter();
  }

  function close() {
    isOpen = false;
    overlay.classList.remove('open');
    if (metricsInterval) { clearInterval(metricsInterval); metricsInterval = null; }
    if (fpsRafId) { cancelAnimationFrame(fpsRafId); fpsRafId = null; }
  }

  function startFpsCounter() {
    if (fpsRafId) return;
    frames = 0;
    lastTime = performance.now();
    function frame(time) {
      frames++;
      if (time - lastTime >= 1000) {
        fps = frames;
        frames = 0;
        lastTime = time;
        var fpsEl = document.getElementById('devFps');
        if (fpsEl) {
          fpsEl.textContent = fps;
          fpsEl.style.color = fps >= 50 ? 'var(--clr-success)' : fps >= 30 ? 'var(--clr-warning)' : 'var(--clr-danger)';
        }
      }
      fpsRafId = requestAnimationFrame(frame);
    }
    fpsRafId = requestAnimationFrame(frame);
  }

  function updateMetrics() {
    var state = typeof AppStore !== 'undefined' ? AppStore.getState() : null;

    // Memory
    if (performance.memory) {
      var memEl = document.getElementById('devMemory');
      if (memEl) memEl.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB';
    }

    // DOM Nodes
    var domEl = document.getElementById('devDomNodes');
    if (domEl) domEl.textContent = document.querySelectorAll('*').length;

    // Storage
    var storageEl = document.getElementById('devStorage');
    if (storageEl) {
      var total = 0;
      for (var key in localStorage) {
        if (localStorage.hasOwnProperty(key)) total += localStorage[key].length * 2;
      }
      storageEl.textContent = total > 1024 ? Math.round(total / 1024) + ' KB' : total + ' B';
    }

    // Route
    var routeEl = document.getElementById('devRoute');
    if (routeEl && typeof Router !== 'undefined') routeEl.textContent = Router.getCurrentRoute() || '—';

    // Theme
    var themeEl = document.getElementById('devTheme');
    if (themeEl && typeof ThemeManager !== 'undefined') themeEl.textContent = ThemeManager.getCurrent() || '—';

    // Auth
    var authEl = document.getElementById('devAuth');
    if (authEl && typeof AuthManager !== 'undefined') authEl.textContent = AuthManager.isLoggedIn() ? 'Logged in as ' + AuthManager.getUser().name : 'Guest';

    // Users/Tx count
    if (state) {
      var uEl = document.getElementById('devUsers');
      if (uEl) uEl.textContent = (state.users || []).length;
      var tEl = document.getElementById('devTx');
      if (tEl) tEl.textContent = (state.transactions || []).length;
    }

    // API
    var apiEl = document.getElementById('devApi');
    if (apiEl) apiEl.textContent = navigator.onLine ? 'Online' : 'Offline';

    // Settings
    var settingsEl = document.getElementById('devSettings');
    if (settingsEl && state && state.settings) {
      settingsEl.textContent = Object.keys(state.settings).length + ' options';
    }
  }

  return { init: init, open: open, close: close };
})();
