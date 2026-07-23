var DevConsole = (function() {
  var isOpen = false;
  var fps = 0;
  var frames = 0;
  var lastTime = performance.now();
  var overlay = null;
  var fpsInterval = null;
  var metricsInterval = null;
  var fpsRafId = null;
  function init() {
    var div = document.createElement("div");
    div.id = "devConsole";
    div.className = "dev-console";
    div.innerHTML = [
      '<div class="dev-console__header">',
      '<span class="dev-console__title">Developer Console</span>',
      '<button class="dev-console__close" id="devConsoleClose">&times;</button>',
      "</div>",
      '<div class="dev-console__body">',
      '<div class="dev-console__grid">',
      '<div class="dev-console__metric"><div class="dev-console__metric-value" id="devFps">0</div><div class="dev-console__metric-label">FPS</div></div>',
      '<div class="dev-console__metric"><div class="dev-console__metric-value" id="devMemory">0 MB</div><div class="dev-console__metric-label">Memory</div></div>',
      '<div class="dev-console__metric"><div class="dev-console__metric-value" id="devDomNodes">0</div><div class="dev-console__metric-label">DOM Nodes</div></div>',
      '<div class="dev-console__metric"><div class="dev-console__metric-value" id="devStorage">0 KB</div><div class="dev-console__metric-label">Storage</div></div>',
      "</div>",
      '<div class="dev-console__details">',
      '<div class="dev-console__row"><span>Route</span><span id="devRoute">\u2014</span></div>',
      '<div class="dev-console__row"><span>Theme</span><span id="devTheme">\u2014</span></div>',
      '<div class="dev-console__row"><span>Auth</span><span id="devAuth">\u2014</span></div>',
      '<div class="dev-console__row"><span>Users</span><span id="devUsers">0</span></div>',
      '<div class="dev-console__row"><span>Transactions</span><span id="devTx">0</span></div>',
      '<div class="dev-console__row"><span>API Status</span><span id="devApi">\u2014</span></div>',
      '<div class="dev-console__row"><span>Settings</span><span id="devSettings">\u2014</span></div>',
      "</div>",
      '<div class="dev-console__actions">',
      '<button class="btn btn--sm btn--secondary" id="devClearCache">Clear Cache</button>',
      '<button class="btn btn--sm btn--secondary" id="devClearStorage">Clear Storage</button>',
      '<button class="btn btn--sm btn--danger" id="devResetData">Reset All Data</button>',
      "</div>",
      "</div>"
    ].join("\n");
    document.body.appendChild(div);
    overlay = div;
    var devClose = document.getElementById("devConsoleClose");
    if (devClose) devClose.addEventListener("click", close);
    var devClearCache = document.getElementById("devClearCache");
    if (devClearCache) devClearCache.addEventListener("click", function() {
      ApiClient.clearCache();
      if (typeof ToastSystem !== "undefined") ToastSystem.success("API cache cleared");
      updateMetrics();
    });
    var devClearStorage = document.getElementById("devClearStorage");
    if (devClearStorage) devClearStorage.addEventListener("click", function() {
      if (confirm("Clear all localStorage?")) {
        localStorage.clear();
        if (typeof ToastSystem !== "undefined") ToastSystem.success("Storage cleared");
        updateMetrics();
      }
    });
    var devResetData = document.getElementById("devResetData");
    if (devResetData) devResetData.addEventListener("click", function() {
      if (confirm("Reset all data to defaults?")) {
        localStorage.removeItem("saas_dashboard_state");
        localStorage.removeItem("saas_activity_log");
        window.location.reload();
      }
    });
    document.addEventListener("keydown", function(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        toggle();
      }
    });
  }
  function toggle() {
    isOpen ? close() : open();
  }
  function open() {
    isOpen = true;
    overlay.classList.add("open");
    metricsInterval = setInterval(updateMetrics, 1e3);
    updateMetrics();
    startFpsCounter();
  }
  function close() {
    isOpen = false;
    overlay.classList.remove("open");
    if (metricsInterval) {
      clearInterval(metricsInterval);
      metricsInterval = null;
    }
    if (fpsRafId) {
      cancelAnimationFrame(fpsRafId);
      fpsRafId = null;
    }
  }
  function startFpsCounter() {
    if (fpsRafId) return;
    frames = 0;
    lastTime = performance.now();
    function frame(time) {
      frames++;
      if (time - lastTime >= 1e3) {
        fps = frames;
        frames = 0;
        lastTime = time;
        var fpsEl = document.getElementById("devFps");
        if (fpsEl) {
          fpsEl.textContent = fps;
          fpsEl.style.color = fps >= 50 ? "var(--clr-success)" : fps >= 30 ? "var(--clr-warning)" : "var(--clr-danger)";
        }
      }
      fpsRafId = requestAnimationFrame(frame);
    }
    fpsRafId = requestAnimationFrame(frame);
  }
  function updateMetrics() {
    var state = typeof AppStore !== "undefined" ? AppStore.getState() : null;
    if (performance.memory) {
      var memEl = document.getElementById("devMemory");
      if (memEl) memEl.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB";
    }
    var domEl = document.getElementById("devDomNodes");
    if (domEl) domEl.textContent = document.getElementsByTagName("*").length;
    var storageEl = document.getElementById("devStorage");
    if (storageEl) {
      var total = 0;
      for (var key in localStorage) {
        if (localStorage.hasOwnProperty(key)) total += localStorage[key].length * 2;
      }
      storageEl.textContent = total > 1024 ? Math.round(total / 1024) + " KB" : total + " B";
    }
    var routeEl = document.getElementById("devRoute");
    if (routeEl && typeof Router !== "undefined") routeEl.textContent = Router.getCurrentRoute() || "\u2014";
    var themeEl = document.getElementById("devTheme");
    if (themeEl && typeof ThemeManager !== "undefined") themeEl.textContent = ThemeManager.getCurrent() || "\u2014";
    var authEl = document.getElementById("devAuth");
    if (authEl && typeof AuthManager !== "undefined") authEl.textContent = AuthManager.isLoggedIn() ? "Logged in as " + AuthManager.getUser().name : "Guest";
    if (state) {
      var uEl = document.getElementById("devUsers");
      if (uEl) uEl.textContent = (state.users || []).length;
      var tEl = document.getElementById("devTx");
      if (tEl) tEl.textContent = (state.transactions || []).length;
    }
    var apiEl = document.getElementById("devApi");
    if (apiEl) apiEl.textContent = navigator.onLine ? "Online" : "Offline";
    var settingsEl = document.getElementById("devSettings");
    if (settingsEl && state && state.settings) {
      settingsEl.textContent = Object.keys(state.settings).length + " options";
    }
  }
  return { init, open, close };
})();
