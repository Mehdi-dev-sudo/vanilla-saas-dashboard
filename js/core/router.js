const Router = (function () {
  let currentRoute = null;
  let currentCleanup = null;
  const routes = {};
  const contentEl = document.getElementById('appContent');
  const loaderEl = document.getElementById('pageLoader');

  function register(name, handler) {
    routes[name] = handler;
  }

  function navigate(name) {
    if (name === currentRoute) return;
    if (!routes[name]) { name = 'dashboard'; }

    if (currentCleanup && typeof currentCleanup === 'function') {
      currentCleanup();
      currentCleanup = null;
    }

    currentRoute = name;
    location.hash = name;

    showLoader();

    requestAnimationFrame(() => {
      const handler = routes[name];
      if (handler && typeof handler.render === 'function') {
        contentEl.innerHTML = handler.render();
        hideLoader();

        if (typeof handler.init === 'function') {
          currentCleanup = handler.init();
        }

        updateSidebar(name);
        updatePageMeta(name);
      } else {
        contentEl.innerHTML = '<div class="empty-state"><div class="empty-state__title">Page not found</div></div>';
        hideLoader();
      }
    });
  }

  function resolve() {
    const hash = location.hash.slice(1) || 'dashboard';
    navigate(hash);
  }

  function getCurrentRoute() {
    return currentRoute;
  }

  function showLoader() {
    if (loaderEl) loaderEl.style.display = 'flex';
  }

  function hideLoader() {
    if (loaderEl) loaderEl.style.display = 'none';
  }

  function updateSidebar(route) {
    document.querySelectorAll('.sidebar__item').forEach(item => {
      item.classList.toggle('active', item.dataset.route === route);
    });
  }

  function updatePageMeta(route) {
    const titles = {
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      users: 'Users',
      transactions: 'Transactions',
      settings: 'Settings',
      support: 'Support'
    };
    document.title = (titles[route] || 'Dashboard') + ' — SaaS Dashboard';
  }

  function init() {
    window.addEventListener('hashchange', resolve);
    resolve();
  }

  return {
    init,
    register,
    navigate,
    getCurrentRoute
  };
})();
