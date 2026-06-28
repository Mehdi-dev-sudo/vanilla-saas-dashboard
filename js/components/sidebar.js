const SidebarManager = (function () {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const collapseBtn = document.getElementById('sidebarCollapse');
  const menuToggle = document.getElementById('menuToggle');

  function init() {
    if (localStorage.getItem('sidebar_collapsed') === 'true') {
      sidebar.classList.add('collapsed');
    }
    collapseBtn.addEventListener('click', toggleCollapse);
    menuToggle.addEventListener('click', openMobile);
    overlay.addEventListener('click', closeMobile);

    document.querySelectorAll('.sidebar__logo').forEach(el => {
      el.addEventListener('click', function (e) {
        Router.navigate('dashboard');
        if (window.innerWidth <= 1024) closeMobile();
      });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && sidebar.classList.contains('open')) {
        closeMobile();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeMobile();
      }
    });
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
