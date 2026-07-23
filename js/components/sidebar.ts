/**
 * SidebarManager — Responsive sidebar with collapse, mobile overlay, and keyboard nav.
 * @module SidebarManager
 */
const SidebarManager = (function () {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const collapseBtn = document.getElementById('sidebarCollapse');
  const menuToggle = document.getElementById('menuToggle');

  function init() {
    try {
      if (SafeStorage.getItem('sidebar_collapsed') === 'true' && sidebar) {
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
    if (!sidebar) return;
    sidebar.classList.toggle('collapsed');
    SafeStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 350);
  }

  function openMobile() {
    if (!sidebar || !overlay) return;
    sidebar.classList.add('open');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    var modal = document.getElementById('modalOverlay');
    if (!modal || !modal.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  return { init, toggleCollapse, openMobile, closeMobile };
})();
