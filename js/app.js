(function () {
  function init() {
    Router.register('dashboard', DashboardPage);
    Router.register('analytics', AnalyticsPage);
    Router.register('users', UsersPage);
    Router.register('transactions', TransactionsPage);
    Router.register('settings', SettingsPage);
    Router.register('support', SupportPage);

    Router.init();
    SidebarManager.init();
    ThemeManager.init();
    ModalSystem.init();

    setupGlobalSearch();
    setupNotifications();
    setupKeyboardShortcuts();

    window.addEventListener('resize', Utils.debounce(function () {
      ChartEngine.resize();
    }, 250));
  }

  function setupGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    const originalPlaceholder = searchInput.placeholder;

    searchInput.addEventListener('focus', function () {
      this.placeholder = 'Search users or transactions...';
    });
    searchInput.addEventListener('blur', function () {
      this.placeholder = originalPlaceholder;
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && this.value.trim()) {
        const query = this.value.trim();
        const route = Router.getCurrentRoute();
        if (route === 'users') {
          const searchInput = document.getElementById('userSearch');
          if (searchInput) { searchInput.value = query; searchInput.dispatchEvent(new Event('input')); }
        } else if (route === 'transactions') {
          const txSearch = document.getElementById('transactionSearch');
          if (txSearch) { txSearch.value = query; txSearch.dispatchEvent(new Event('input')); }
        } else {
          Router.navigate('users');
          setTimeout(function () {
            const searchInput = document.getElementById('userSearch');
            if (searchInput) { searchInput.value = query; searchInput.dispatchEvent(new Event('input')); }
          }, 100);
        }
        this.value = '';
        this.blur();
      }
    });
  }

  function setupNotifications() {
    const notifBtn = document.getElementById('notifBtn');
    const badge = document.getElementById('notifBadge');

    AppStore.subscribe('notifications', function (count) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });

    notifBtn.addEventListener('click', function () {
      AppStore.clearNotifications();
      ToastSystem.info('No new notifications');
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch').focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
