/**
 * Router — Hash-based SPA router with lifecycle, breadcrumbs, and loader.
 * @module Router
 */
const Router = (function () {
  var currentRoute = null;
  var currentCleanup = null;
  var previousRoute = null;
  var routes = {};
  var contentEl = document.getElementById('appContent');
  var loaderEl = document.getElementById('pageLoader');
  var navGeneration = 0;

  var routeMeta = {
    dashboard: { title: function () { return __('route.dashboard'); }, icon: 'grid', parent: null },
    analytics: { title: function () { return __('route.analytics'); }, icon: 'bar-chart-2', parent: null },
    users: { title: function () { return __('route.users'); }, icon: 'users', parent: null },
    transactions: { title: function () { return __('route.transactions'); }, icon: 'credit-card', parent: null },
    settings: { title: function () { return __('route.settings'); }, icon: 'settings', parent: null },
    support: { title: function () { return __('route.support'); }, icon: 'help-circle', parent: null },
    error: { title: function () { return __('route.error'); }, icon: 'alert-triangle', parent: null }
  };

  function renderBreadcrumbs(route) {
    var m = routeMeta[route];
    if (!m || !m.parent) return '';
    return '<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#dashboard" class="breadcrumbs__link">' + __('breadcrumb.home') + '</a><span class="breadcrumbs__sep">/</span><span class="breadcrumbs__current">' + (typeof m.title === 'function' ? m.title() : m.title) + '</span></nav>';
  }

  function register(name, handler) {
    routes[name] = handler;
  }

  function navigate(name) {
    try {
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

      if (typeof ChartEngine !== 'undefined' && ChartEngine.clearCache) ChartEngine.clearCache();
      if (typeof ModalSystem !== 'undefined' && ModalSystem.close) ModalSystem.close();
      if (typeof ContextMenuManager !== 'undefined' && ContextMenuManager.hide) ContextMenuManager.hide();
      if (typeof SidebarManager !== 'undefined' && SidebarManager.closeMobile) SidebarManager.closeMobile();

      previousRoute = currentRoute;
      currentRoute = name;
      if (name !== 'login') location.hash = name;
      if (contentEl) contentEl.scrollTop = 0;

      showLoader();

      var gen = ++navGeneration;
      requestAnimationFrame(function () {
        if (gen !== navGeneration) return;
        try {
          if (name === 'login') {
            renderLogin();
            return;
          }

          var handler = routes[name];
          if (handler && typeof handler.render === 'function') {
            if (!contentEl) { hideLoader(); return; }
            contentEl.innerHTML = '<div class="page-wrapper">' + renderBreadcrumbs(name) + handler.render() + '</div>';
            requestAnimationFrame(function () { if (gen === navGeneration) hideLoader(); });
            if (typeof handler.init === 'function') {
              try {
                currentCleanup = handler.init() || null;
              } catch (initErr) {
                console.error('Page init error:', initErr);
                currentCleanup = null;
              }
            }
            updateSidebar(name);
            updatePageMeta(name);
          } else {
            if (!contentEl) { hideLoader(); return; }
            contentEl.innerHTML = ErrorPage.render('404');
            hideLoader();
            updateSidebar(null);
            document.title = '404 — Vanilla SaaS Dashboard';
          }
        } catch (e) {
          console.error('Render error:', e);
          if (contentEl) contentEl.innerHTML = '<div class="page-wrapper"><div class="empty-state"><div class="empty-state__icon">!</div><div class="empty-state__title">Something went wrong</div><div class="empty-state__desc">' + (typeof Utils !== 'undefined' ? Utils.escapeHtml(e.message || 'Unknown error') : (e.message || 'Unknown error')) + '</div><button class="btn btn--primary" onclick="location.reload()">Reload</button></div></div>';
          hideLoader();
        }
      });
    } catch (e) {
      console.error('Navigate error:', e);
      hideLoader();
    }
  }

  function renderLogin() {
    if (!contentEl) { hideLoader(); return; }
    if (typeof AuthManager !== 'undefined' && AuthManager.getLoginPage) {
      contentEl.innerHTML = AuthManager.getLoginPage();
      hideLoader();
      if (typeof AuthManager.initLoginPage === 'function') {
        currentCleanup = AuthManager.initLoginPage();
      }
      updateSidebar(null);
      document.title = 'Sign In — Vanilla SaaS Dashboard';
      var sidebarEl = document.querySelector('.sidebar');
      if (sidebarEl) sidebarEl.classList.remove('open');
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
    var items = document.querySelectorAll('.sidebar__item');
    if (!items || !items.length) return;
    items.forEach(function (item) {
      item.classList.toggle('active', item.dataset.route === route);
    });
  }

  function updatePageMeta(route) {
    var m = routeMeta[route] || routeMeta.dashboard;
    document.title = (typeof m.title === 'function' ? m.title() : m.title) + ' — Vanilla SaaS Dashboard';
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
