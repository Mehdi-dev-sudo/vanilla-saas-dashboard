/**
 * EmptyState — Consistent empty state display.
 * @module EmptyState
 */
const EmptyState = (function () {
  function render(title, desc, icon) {
    icon = icon || '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
    return '<div class="empty-state"><div class="empty-state__icon">' + icon + '</div><div class="empty-state__title">' + title + '</div><div class="empty-state__desc">' + (desc || '') + '</div></div>';
  }
  return { render: render };
})();