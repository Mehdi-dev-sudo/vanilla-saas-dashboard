(function () {
  function init() {
    Router.register('dashboard', DashboardPage);
    Router.register('analytics', AnalyticsPage);
    Router.register('users', UsersPage);
    Router.register('transactions', TransactionsPage);
    Router.register('settings', SettingsPage);
    Router.register('support', SupportPage);
    Router.register('error', ErrorPage);

    HistoryManager.init();
    AuthManager.init();
    Router.init();
    SidebarManager.init();
    ThemeManager.init();
    ModalSystem.init();
    CommandPalette.init();
    ContextMenuManager.init();

    initClock();
    initOnlineCounter();
    initLastUpdated();
    setupGlobalSearch();
    setupNotifications();
    setupKeyboardNavigation();

    window.addEventListener('resize', Utils.debounce(function () {
      ChartEngine.resize();
    }, 250));

    initApiData();
  }

  function initApiData() {
    var statusEl = document.getElementById('apiStatus');
    if (!statusEl) return;

    Promise.all([
      ApiClient.fetchUsers().then(function (users) {
        AppStore.getState('users').length <= 10 && AppStore.setState('users', users);
      }).catch(function () { /* fallback to mock */ }),
      ApiClient.fetchTransactions().then(function (tx) {
        AppStore.getState('transactions').length <= 10 && AppStore.setState('transactions', tx);
      }).catch(function () { /* fallback to mock */ })
    ]).then(function () {
      statusEl.textContent = 'API ✓';
      statusEl.className = 'header__api-status header__api-status--online';
    }).catch(function () {
      statusEl.textContent = 'Mock';
      statusEl.className = 'header__api-status header__api-status--offline';
    });
  }
};

window.addEventListener('resize', Utils.debounce(function () {
      ChartEngine.resize();
    }, 250));
  }

  var saveIndicatorTimer = null;

  window.showSaveIndicator = function () {
    var el = document.getElementById('saveIndicator');
    if (!el) return;
    el.style.display = 'flex';
    if (saveIndicatorTimer) clearTimeout(saveIndicatorTimer);
    saveIndicatorTimer = setTimeout(function () { el.style.display = 'none'; }, 2000);
  };

  function initLastUpdated() {
    var el = document.getElementById('lastUpdated');
    if (!el) return;
    function update() {
      var now = new Date();
      var time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      el.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Updated ' + time;
    }
    update();
    setInterval(update, 30000);
  }

  function initOnlineCounter() {
    var el = document.getElementById('headerOnline');
    if (!el) return;
    function updateOnline() {
      var base = AppStore ? AppStore.getState('users').filter(function(u) { return u.status === 'active'; }).length : 0;
      var online = base + Math.round(Math.random() * 3);
      el.innerHTML = '<span class="online-dot"></span> ' + online + ' online';
    }
    updateOnline();
    setInterval(updateOnline, 8000);
  }

  function initClock() {
    var clockEl = document.getElementById('headerClock');
    if (!clockEl) return;
    function updateClock() {
      var now = new Date();
      var opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      clockEl.textContent = now.toLocaleTimeString('en-US', opts);
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  function setupGlobalSearch() {
    var searchInput = document.getElementById('globalSearch');
    var searchClear = document.getElementById('searchClear');
    var originalPlaceholder = searchInput.placeholder;

    searchInput.addEventListener('input', function () {
      searchClear.style.display = this.value ? 'flex' : 'none';
    });

    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchInput.focus();
      searchClear.style.display = 'none';
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
        '<div class="notif-dropdown__item-icon notif-dropdown__item-icon--' + n.type + '"></div>' +
        '<div class="notif-dropdown__item-content">' +
          '<div class="notif-dropdown__item-text">' + n.text + '</div>' +
          '<div class="notif-dropdown__item-time">' + n.time + '</div>' +
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

    document.getElementById('markAllRead').addEventListener('click', function () {
      AppStore.clearNotifications();
      dropdown.querySelectorAll('.notif-dropdown__item--unread').forEach(function (el) { el.classList.remove('notif-dropdown__item--unread'); });
      badge.style.display = 'none';
      ToastSystem.info('All notifications marked as read');
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target) && e.target !== notifBtn) {
        dropdown.classList.remove('open');
      }
    });

    AppStore.subscribe('notifications', function (count) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
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

  function setupKeyboardNavigation() {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === '/' ) {
        e.preventDefault();
        showKeyboardHelp();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        ToastSystem.success('Changes saved');
        ActivityLog.add('edit', 'Quick save triggered', 'edit');
      }

      if (!(e.ctrlKey || e.metaKey) && e.key.length === 1) {
        gotoBuffer += e.key.toLowerCase();
        if (gotoBuffer.length > 4) gotoBuffer = gotoBuffer.slice(-4);
        if (gotoBuffer === 'gd') { Router.navigate('dashboard'); gotoBuffer = ''; }
        if (gotoBuffer === 'gu') { Router.navigate('users'); gotoBuffer = ''; }
        if (gotoBuffer === 'gt') { Router.navigate('transactions'); gotoBuffer = ''; }
        if (gotoBuffer === 'gs') { Router.navigate('settings'); gotoBuffer = ''; }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var openCmd = document.querySelector('.cmd-palette-overlay.open');
        if (openCmd) return;
        var openModal = document.getElementById('modalOverlay');
        if (openModal && openModal.classList.contains('open')) {
          ModalSystem.close();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
