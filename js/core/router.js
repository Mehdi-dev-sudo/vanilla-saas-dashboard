const Router = (function () {
  let currentRoute = null;
  let currentCleanup = null;
  let previousRoute = null;
  const routes = {};
  const contentEl = document.getElementById('appContent');
  const loaderEl = document.getElementById('pageLoader');

  function register(name, handler) {
    routes[name] = handler;
  }

  function navigate(name) {
    if (name === currentRoute) return;

    if (name !== 'login' && typeof AuthManager !== 'undefined' && AuthManager.isLoggedIn && !AuthManager.isLoggedIn()) {
      if (currentRoute !== 'login') {
        previousRoute = name;
      }
      name = 'login';
    }

    if (!routes[name]) {
      if (name === 'login') { /* login is handled specially */ }
      else { name = 'error'; }
    }

    if (currentCleanup && typeof currentCleanup === 'function') {
      currentCleanup();
      currentCleanup = null;
    }

    previousRoute = currentRoute;
    currentRoute = name;
    if (name !== 'login') location.hash = name;

    showLoader();

    requestAnimationFrame(function () {
      if (name === 'login') {
        renderLogin();
        return;
      }

      var handler = routes[name];
      if (handler && typeof handler.render === 'function') {
        contentEl.innerHTML = handler.render();
        hideLoader();
        if (typeof handler.init === 'function') {
          currentCleanup = handler.init();
        }
        updateSidebar(name);
        updatePageMeta(name);
      } else {
        contentEl.innerHTML = ErrorPage.render('404');
        hideLoader();
        updateSidebar(null);
        document.title = '404 — SaaS Dashboard';
      }
    });
  }

  function renderLogin() {
    if (typeof AuthManager !== 'undefined' && AuthManager.getLoginPage) {
      contentEl.innerHTML = AuthManager.getLoginPage();
      hideLoader();
      if (typeof AuthManager.initLoginPage === 'function') {
        currentCleanup = AuthManager.initLoginPage();
      }
      updateSidebar(null);
      document.title = 'Sign In — SaaS Dashboard';
      document.querySelector('.sidebar') && document.querySelector('.sidebar').classList.remove('open');
    }
  }

  function resolve() {
    var hash = location.hash.slice(1) || 'dashboard';
    navigate(hash);
  }

  function getCurrentRoute() {
    return currentRoute;
  }

  function getPreviousRoute() {
    return previousRoute;
  }

  function showLoader() {
    if (loaderEl) {
      loaderEl.style.display = 'flex';
      if (typeof SkeletonLoader !== 'undefined') {
        loaderEl.innerHTML = SkeletonLoader.getStatsSkeleton() + SkeletonLoader.getChartSkeleton() + SkeletonLoader.getTableSkeleton(3);
      }
    }
  }

  function hideLoader() {
    if (loaderEl) loaderEl.style.display = 'none';
  }

  function updateSidebar(route) {
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.display = (route === 'login' || !route) ? 'none' : 'flex';
    }
    document.querySelectorAll('.sidebar__item').forEach(function (item) {
      item.classList.toggle('active', item.dataset.route === route);
    });
  }

  function updatePageMeta(route) {
    var titles = {
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      users: 'Users',
      transactions: 'Transactions',
      settings: 'Settings',
      support: 'Support',
      error: 'Error'
    };
    document.title = (titles[route] || 'Dashboard') + ' — SaaS Dashboard';
  }

  function init() {
    window.addEventListener('hashchange', resolve);
    setTimeout(resolve, 50);
  }

  return {
    init: init,
    register: register,
    navigate: navigate,
    getCurrentRoute: getCurrentRoute,
    getPreviousRoute: getPreviousRoute
  };
})();
