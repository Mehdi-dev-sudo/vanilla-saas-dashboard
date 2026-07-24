/**
 * App — Application entry point: initializes all modules, router, and lifecycle.
 * @module AppMain
 */
(function () {
  function init() {
    try {
      Router.register('dashboard', DashboardPage);
      Router.register('analytics', AnalyticsPage);
      Router.register('users', UsersPage);
      Router.register('transactions', TransactionsPage);
      Router.register('settings', SettingsPage);
      Router.register('support', SupportPage);
      Router.register('error', ErrorPage);
      Router.register('design-system', DesignSystemPage);

      I18n.init();
      HistoryManager.init();
      AuthManager.init();
      SidebarManager.init();
      ThemeManager.init();
      ModalSystem.init();
      CommandPalette.init();
      ContextMenuManager.init();
      DevConsole.init();
      AnimationEngine.init();
      PluginSystem.init();
    } catch (e) {
      console.error('Init error:', e);
    }
    Router.init();

    initClock();
    initOnlineCounter();
    initLastUpdated();
    setupGlobalSearch();
    setupNotifications();
    setupKeyboardNavigation();
    setupConnectivityListeners();
    setupScrollToTop();

    initApiData();
  }

  function initApiData() {
    var statusEl = document.getElementById('apiStatus');
    if (!statusEl) return;
    var results = [];

    function trackResult(success) {
      results.push(success);
      if (results.length === 2) {
        var allOk = results.every(function (r) { return r; });
        if (allOk) {
          statusEl.textContent = 'API ✓';
          statusEl.className = 'header__api-status header__api-status--online';
        } else {
          statusEl.textContent = results.some(function (r) { return r; }) ? 'Partial' : 'Mock';
          statusEl.className = 'header__api-status header__api-status--offline';
        }
      }
    }

    ApiClient.fetchUsers().then(function (users) {
      try { (AppStore.getState('users') || []).length <= 10 && AppStore.setState('users', users); } catch (e) { /* ignore */ }
      trackResult(true);
    }).catch(function () { trackResult(false); });
    ApiClient.fetchTransactions().then(function (tx) {
      try { (AppStore.getState('transactions') || []).length <= 10 && AppStore.setState('transactions', tx); } catch (e) { /* ignore */ }
      trackResult(true);
    }).catch(function () { trackResult(false); });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearInterval(window.__clockInterval);
      clearInterval(window.__onlineInterval);
      clearInterval(window.__updatedInterval);
      if (typeof DashboardPage !== 'undefined' && DashboardPage.stopRealtimeUpdates) DashboardPage.stopRealtimeUpdates();
    } else {
      if (window.__clockInterval) clearInterval(window.__clockInterval);
      if (window.__onlineInterval) clearInterval(window.__onlineInterval);
      if (window.__updatedInterval) clearInterval(window.__updatedInterval);
    if (window.__clockInterval) clearInterval(window.__clockInterval);
    window.__clockInterval = setInterval(updateClock, 1000);
    if (window.__onlineInterval) clearInterval(window.__onlineInterval);
    window.__onlineInterval = setInterval(updateOnline, 8000);
    if (window.__updatedInterval) clearInterval(window.__updatedInterval);
    window.__updatedInterval = setInterval(updateLastUpdated, 30000);
      if (typeof DashboardPage !== 'undefined' && DashboardPage.startRealtimeUpdates && Router.getCurrentRoute() === 'dashboard') {
        DashboardPage.startRealtimeUpdates();
      }
    }
  });

  var saveIndicatorTimer = null;

  window.showSaveIndicator = function () {
    var el = document.getElementById('saveIndicator');
    if (!el) return;
    el.style.display = 'flex';
    if (saveIndicatorTimer) clearTimeout(saveIndicatorTimer);
    saveIndicatorTimer = setTimeout(function () { el.style.display = 'none'; }, 2000);
  };

  function updateLastUpdated() {
    var el = document.getElementById('lastUpdated');
    if (!el) return;
    var now = new Date();
    var time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    el.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Updated ' + time;
  }

  function initLastUpdated() {
    var el = document.getElementById('lastUpdated');
    if (!el) return;
    updateLastUpdated();
    window.__updatedInterval = setInterval(updateLastUpdated, 30000);
  }

  function updateOnline() {
    var el = document.getElementById('headerOnline');
    if (!el) return;
    try {
      var users = AppStore && AppStore.getState ? (AppStore.getState('users') || []) : [];
      var base = users.filter(function(u) { return u && u.status === 'active'; }).length;
      var online = base + Math.round(Math.random() * 3);
      el.innerHTML = '<span class="online-dot"></span> ' + online + ' online';
    } catch (e) { /* ignore online counter errors */ }
  }

  function initOnlineCounter() {
    var el = document.getElementById('headerOnline');
    if (!el) return;
    updateOnline();
    window.__onlineInterval = setInterval(updateOnline, 8000);
  }

  function updateClock() {
    var clockEl = document.getElementById('headerClock');
    if (!clockEl) return;
    var now = new Date();
    var opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    clockEl.textContent = now.toLocaleTimeString('en-US', opts);
  }

  function initClock() {
    var clockEl = document.getElementById('headerClock');
    if (!clockEl) return;
    updateClock();
    window.__clockInterval = setInterval(updateClock, 1000);
  }

  function setupGlobalSearch() {
    var searchInput = document.getElementById('globalSearch');
    var searchClear = document.getElementById('searchClear');
    if (!searchInput || !searchClear) return;
    var originalPlaceholder = searchInput.placeholder;

    searchInput.addEventListener('input', function () {
      searchClear.classList.toggle('is-hidden', !this.value);
    });

    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchInput.focus();
      searchClear.classList.add('is-hidden');
    });

    searchInput.addEventListener('focus', function () { this.placeholder = 'Search users or transactions...'; });
    searchInput.addEventListener('blur', function () { this.placeholder = originalPlaceholder; });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && this.value.trim()) {
        var query = this.value.trim();
        var route = Router.getCurrentRoute();
        if (route === 'users') { var us = document.getElementById('userSearch'); if (us) { us.value = query; us.dispatchEvent(new Event('input')); } }
        else if (route === 'transactions') { var ts = document.getElementById('transactionSearch'); if (ts) { ts.value = query; ts.dispatchEvent(new Event('input')); } }
        else { Router.navigate('users'); setTimeout(function () { var us = document.getElementById('userSearch'); if (us) { us.value = query; us.dispatchEvent(new Event('input')); } }, 100); }
        this.value = ''; this.blur();
      }
    });
  }

  function getMockNotifications() {
    return [
      { id: 'n1', text: 'New user Sarah Lee signed up', time: '2 min ago', type: 'user', unread: true },
      { id: 'n2', text: 'Payment of $12,000 from Acme Corp received', time: '15 min ago', type: 'payment', unread: true },
      { id: 'n3', text: 'Server CPU threshold exceeded on node-3', time: '1 hour ago', type: 'alert', unread: true },
      { id: 'n4', text: 'Weekly report is ready for export', time: '3 hours ago', type: 'report', unread: false },
      { id: 'n5', text: 'Backup completed successfully', time: '5 hours ago', type: 'system', unread: false }
    ];
  }

  function renderNotifDropdown() {
    var list = document.getElementById('notifList');
    if (!list) return;
    var notifs = getMockNotifications();
    var unreadCount = notifs.filter(function (n) { return n.unread; }).length;
    list.innerHTML = notifs.map(function (n) {
      return '<div class="notif-dropdown__item' + (n.unread ? ' notif-dropdown__item--unread' : '') + '">' +
        '<div class="notif-dropdown__item-icon notif-dropdown__item-icon--' + Utils.escapeHtml(n.type) + '"></div>' +
        '<div class="notif-dropdown__item-content">' +
          '<div class="notif-dropdown__item-text">' + Utils.escapeHtml(n.text) + '</div>' +
          '<div class="notif-dropdown__item-time">' + Utils.escapeHtml(n.time) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    var badge = document.getElementById('notifBadge');
    if (badge) { badge.textContent = unreadCount; badge.style.display = unreadCount > 0 ? 'flex' : 'none'; }
  }

  function setupNotifications() {
    var notifBtn = document.getElementById('notifBtn');
    var dropdown = document.getElementById('notifDropdown');
    var badge = document.getElementById('notifBadge');

    if (!notifBtn || !dropdown) return;

    renderNotifDropdown();

    notifBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('keydown', function notifEsc(e) {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
      }
    });

    var markAllBtn = document.getElementById('markAllRead');
    if (markAllBtn) markAllBtn.addEventListener('click', function () {
      if (typeof AppStore.clearNotifications === 'function') AppStore.clearNotifications();
      dropdown.querySelectorAll('.notif-dropdown__item--unread').forEach(function (el) { el.classList.remove('notif-dropdown__item--unread'); });
      if (badge) badge.style.display = 'none';
      if (typeof ToastSystem !== 'undefined') ToastSystem.info('All notifications marked as read');
    });

    var notifOutsideClick = function (e) {
      if (!dropdown.contains(e.target) && e.target !== notifBtn) {
        dropdown.classList.remove('open');
      }
    };
    document.addEventListener('click', notifOutsideClick);

    var notifUnsub = AppStore.subscribe('notifications', function (count) {
      var unreadCount = typeof count === 'number' ? count : (count && count.length ? count.length : 0);
      if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
      }
    });
  }

  function setupScrollToTop() {
    var btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    var toggle = function () {
      btn.classList.toggle('visible', window.scrollY > 300);
    };
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
  }

  function showKeyboardHelp() {
    ModalSystem.open(
      '<div class="modal__header"><h2 class="modal__title">Keyboard Shortcuts <button class="modal__close" data-modal-close aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></h2></div>' +
      '<div class="modal__body" style="max-height:400px;overflow-y:auto">' +
        '<div class="shortcut-group"><div class="shortcut-row"><span class="shortcut-keys"><kbd>Ctrl</kbd>+<kbd>K</kbd></span><span>Command palette</span></div>' +
        '<div class="shortcut-row"><span class="shortcut-keys"><kbd>Ctrl</kbd>+<kbd>S</kbd></span><span>Quick save</span></div>' +
        '<div class="shortcut-row"><span class="shortcut-keys"><kbd>Ctrl</kbd>+<kbd>Z</kbd></span><span>Undo</span></div>' +
        '<div class="shortcut-row"><span class="shortcut-keys"><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd></span><span>Redo</span></div>' +
        '<div class="shortcut-row"><span class="shortcut-keys"><kbd>Ctrl</kbd>+<kbd>/</kbd></span><span>Keyboard shortcuts</span></div>' +
        '<div class="shortcut-row"><span class="shortcut-keys"><kbd>Escape</kbd></span><span>Close modal / palette</span></div>' +
        '<div class="shortcut-row"><span class="shortcut-keys"><kbd>G</kbd>+<kbd>D</kbd></span><span>Go to Dashboard</span></div>' +
        '<div class="shortcut-row"><span class="shortcut-keys"><kbd>G</kbd>+<kbd>U</kbd></span><span>Go to Users</span></div>' +
        '<div class="shortcut-row"><span class="shortcut-keys"><kbd>G</kbd>+<kbd>T</kbd></span><span>Go to Transactions</span></div>' +
        '<div class="shortcut-row"><span class="shortcut-keys"><kbd>G</kbd>+<kbd>S</kbd></span><span>Go to Settings</span></div>' +
        '</div>' +
      '</div>',
      function () {}
    );
  }

  var gotoBuffer = '';
  var gotoBufferTimer = null;

  function resetGotoBufferTimeout() {
    if (gotoBufferTimer) clearTimeout(gotoBufferTimer);
    gotoBufferTimer = setTimeout(function () { gotoBuffer = ''; gotoBufferTimer = null; }, 1500);
  }

  function isTyping() {
    var tag = document.activeElement ? document.activeElement.tagName : '';
    var type = document.activeElement ? document.activeElement.type : '';
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || type === 'search' || type === 'text' || type === 'email' || type === 'password';
  }

  var _kbNavHandler, _escapeHandler;

  function setupKeyboardNavigation() {
    _kbNavHandler = function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === '/' ) {
        e.preventDefault();
        showKeyboardHelp();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (typeof ToastSystem !== 'undefined') ToastSystem.success('Changes saved');
        ActivityLog.add('edit', 'Quick save triggered', 'edit');
      }

      if (!(e.ctrlKey || e.metaKey) && e.key && e.key.length === 1 && !isTyping()) {
        gotoBuffer += e.key.toLowerCase();
        if (gotoBuffer.length > 4) gotoBuffer = gotoBuffer.slice(-4);
        if (gotoBuffer === 'gd') { Router.navigate('dashboard'); gotoBuffer = ''; }
        if (gotoBuffer === 'gu') { Router.navigate('users'); gotoBuffer = ''; }
        if (gotoBuffer === 'gt') { Router.navigate('transactions'); gotoBuffer = ''; }
        if (gotoBuffer === 'gs') { Router.navigate('settings'); gotoBuffer = ''; }
        resetGotoBufferTimeout();
      }
    };
    document.addEventListener('keydown', _kbNavHandler);

    _escapeHandler = function (e) {
      if (e.key === 'Escape') {
        var openCmd = document.querySelector('.cmd-palette-overlay.open');
        if (openCmd) return;
        var openModal = document.getElementById('modalOverlay');
        if (openModal && openModal.classList.contains('open')) {
          ModalSystem.close();
        }
      }
    };
    document.addEventListener('keydown', _escapeHandler);
  }

  var _onlineHandler, _offlineHandler;

  function setupConnectivityListeners() {
    _onlineHandler = function () {
      var statusEl = document.getElementById('apiStatus');
      if (statusEl) {
        statusEl.textContent = 'API ???';
        statusEl.className = 'header__api-status header__api-status--online';
      }
      if (typeof ToastSystem !== 'undefined') ToastSystem.success('Connection restored');
    };
    window.addEventListener('online', _onlineHandler);

    _offlineHandler = function () {
      var statusEl = document.getElementById('apiStatus');
      if (statusEl) {
        statusEl.textContent = 'Offline';
        statusEl.className = 'header__api-status header__api-status--offline';
      }
      if (typeof ToastSystem !== 'undefined') ToastSystem.warning('You are offline');
    };
    window.addEventListener('offline', _offlineHandler);
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () { /* SW registration requires HTTPS */ });
  }

  var _globalErrorHandler = function (e) {
    console.error('Global error:', e.error || e.message);
    var loader = document.getElementById('pageLoader');
    if (loader) loader.style.display = 'none';
  };
  window.addEventListener('error', _globalErrorHandler);

  // Debug overlay for errors (visible when live server running)
  var _origOnError = window.onerror;
  window.onerror = function (msg, url, line, col, err) {
    var dbg = document.getElementById('debugError');
    if (!dbg) {
      dbg = document.createElement('div');
      dbg.id = 'debugError';
      dbg.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#1a1b2e;color:#ef4444;padding:8px 12px;font:11px monospace;z-index:9999;border-top:2px solid #ef4444;max-height:120px;overflow:auto;white-space:pre-wrap';
      document.body.appendChild(dbg);
    }
    var stack = err && err.stack ? err.stack.split('\n').slice(0,3).join('\n') : (url ? 'at ' + url + ':' + line : '');
    var MAX_ERRORS = 20;
    while (dbg.children.length >= MAX_ERRORS) dbg.removeChild(dbg.firstChild);
    var entry = document.createElement('div');
    entry.textContent = 'Error: ' + (msg || (err && err.message) || 'unknown') + '\n' + stack;
    dbg.appendChild(entry);
    dbg.scrollTop = dbg.scrollHeight;
    console.error(msg, url, line, col, err);
    if (typeof _origOnError === 'function') _origOnError(msg, url, line, col, err);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
