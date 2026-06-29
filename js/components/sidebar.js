const SidebarManager = (function () {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const collapseBtn = document.getElementById('sidebarCollapse');
  const menuToggle = document.getElementById('menuToggle');

  function init() {
    try {
      if (localStorage.getItem('sidebar_collapsed') === 'true' && sidebar) {
        sidebar.classList.add('collapsed');
      }
      if (collapseBtn) collapseBtn.addEventListener('click', toggleCollapse);
      if (menuToggle) menuToggle.addEventListener('click', openMobile);
      if (overlay) overlay.addEventListener('click', closeMobile);

      document.querySelectorAll('.sidebar__logo').forEach(function (el) {
        el.addEventListener('click', function (e) {
          if (typeof Router !== 'undefined') Router.navigate('dashboard');
          if (window.innerWidth <= 1024) closeMobile();
        });
      });

      window.addEventListener('resize', function () {
        if (window.innerWidth > 1024 && sidebar && sidebar.classList.contains('open')) {
          closeMobile();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
          closeMobile();
        }
      });
    } catch (e) { console.error('Sidebar init error:', e); }
  }

  function toggleCollapse() {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 350);
  }

  function openMobile() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  return { init, toggleCollapse, openMobile, closeMobile };
})();
