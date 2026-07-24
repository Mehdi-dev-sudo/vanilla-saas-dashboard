/**
 * LoadingOverlay — Full-page loading overlay.
 * @module LoadingOverlay
 */
const LoadingOverlay = (function () {
  function show(containerId) {
    var c = containerId ? document.getElementById(containerId) : document.querySelector('.content');
    if (!c) return;
    c.innerHTML = '<div class="loading-overlay"><div class="loading-spinner"></div></div>';
  }
  function hide(containerId) {
    var c = containerId ? document.getElementById(containerId) : document.querySelector('.content');
    if (c) { var ov = c.querySelector('.loading-overlay'); if (ov) ov.remove(); }
  }
  return { show: show, hide: hide };
})();