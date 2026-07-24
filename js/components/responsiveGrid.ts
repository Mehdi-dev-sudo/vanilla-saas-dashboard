/**
 * ResponsiveGrid — Responsive grid layout helper.
 * @module ResponsiveGrid
 */
const ResponsiveGrid = (function () {
  function create(containerId, cols, gap) {
    var c = document.getElementById(containerId);
    if (!c) return null;
    c.style.display = 'grid';
    c.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    c.style.gap = gap || 'var(--space-md)';
    function setCols(n) { c.style.gridTemplateColumns = 'repeat(' + n + ', 1fr)'; }
    return { setCols: setCols, el: c };
  }
  return { create: create };
})();