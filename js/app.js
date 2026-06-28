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
    setupGlobalSearch();
    setupNotifications();
    setupKeyboardNavigation();

    window.addEventListener('resize', Utils.debounce(function () {
      ChartEngine.resize();
    }, 250));
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
    var originalPlaceholder = searchInput.placeholder;

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

  function setupNotifications() {
    var notifBtn = document.getElementById('notifBtn');
    var badge = document.getElementById('notifBadge');

    AppStore.subscribe('notifications', function (count) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });

    notifBtn.addEventListener('click', function () {
      AppStore.clearNotifications();
      ToastSystem.info('No new notifications');
    });
  }

  function setupKeyboardNavigation() {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        ToastSystem.success('Changes saved');
        ActivityLog.add('edit', 'Quick save triggered', 'edit');
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
