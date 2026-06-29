const Router = (function () {
  var currentRoute = null;
  var currentCleanup = null;
  var previousRoute = null;
  var routes = {};
  var contentEl = document.getElementById('appContent');
  var loaderEl = document.getElementById('pageLoader');

  var routeMeta = {
    dashboard: { title: 'Dashboard', icon: 'grid', parent: null },
    analytics: { title: 'Analytics', icon: 'bar-chart-2', parent: 'Dashboard' },
    users: { title: 'Users', icon: 'users', parent: 'Management' },
    transactions: { title: 'Transactions', icon: 'credit-card', parent: 'Management' },
    settings: { title: 'Settings', icon: 'settings', parent: null },
    support: { title: 'Support', icon: 'help-circle', parent: null },
    error: { title: 'Error', icon: 'alert-triangle', parent: null }
  };

  function renderBreadcrumbs(route) {
    var m = routeMeta[route];
    if (!m || !m.parent) return '';
    return '<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#dashboard" class="breadcrumbs__link">Home</a><span class="breadcrumbs__sep">/</span><span class="breadcrumbs__current">' + m.title + '</span></nav>';
  }

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
    contentEl.scrollTop = 0;

    showLoader();

    requestAnimationFrame(function () {
      if (name === 'login') {
        renderLogin();
        return;
      }

      var handler = routes[name];
      if (handler && typeof handler.render === 'function') {
        contentEl.innerHTML = '<div class="page-wrapper">' + renderBreadcrumbs(name) + handler.render() + '</div>';
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
    var m = routeMeta[route] || routeMeta.dashboard;
    document.title = m.title + ' — SaaS Dashboard';
  }

  function init() {
    window.addEventListener('hashchange', resolve);
    setTimeout(resolve, 50);

    // Safety net: hide loader after 5s regardless of errors
    setTimeout(function () {
      if (loaderEl && loaderEl.style.display !== 'none') {
        hideLoader();
        console.warn('Router safety net: loader hidden after timeout');
      }
    }, 5000);
  }

  return {
    init: init,
    register: register,
    navigate: navigate,
    getCurrentRoute: getCurrentRoute,
    getPreviousRoute: getPreviousRoute
  };
})();
