const SkeletonLoader = (function () {

  function getCardSkeleton() {
    return `
      <div class="skeleton-card">
        <div class="skeleton skeleton--text skeleton--w-40"></div>
        <div class="skeleton skeleton--title skeleton--w-60"></div>
        <div class="skeleton skeleton--text skeleton--w-25"></div>
      </div>
    `;
  }

  function getTableSkeleton(rows) {
    rows = rows || 5;
    var html = '<div class="skeleton-table">';
    html += '<div class="skeleton-table__header">' +
      '<div class="skeleton skeleton--text skeleton--w-15"></div>' +
      '<div class="skeleton skeleton--text skeleton--w-20"></div>' +
      '<div class="skeleton skeleton--text skeleton--w-15"></div>' +
      '<div class="skeleton skeleton--text skeleton--w-15"></div>' +
      '<div class="skeleton skeleton--text skeleton--w-15"></div>' +
    '</div>';
    for (var i = 0; i < rows; i++) {
      html += '<div class="skeleton-table__row">' +
        '<div class="skeleton skeleton--text skeleton--w-25"></div>' +
        '<div class="skeleton skeleton--text skeleton--w-35"></div>' +
        '<div class="skeleton skeleton--text skeleton--w-20"></div>' +
        '<div class="skeleton skeleton--text skeleton--w-15"></div>' +
        '<div class="skeleton skeleton--text skeleton--w-20"></div>' +
      '</div>';
    }
    html += '</div>';
    return html;
  }

  function getChartSkeleton() {
    return '<div class="skeleton-chart"><div class="skeleton skeleton--chart"></div></div>';
  }

  function getStatsSkeleton() {
    return '<div class="stats">' + getCardSkeleton() + getCardSkeleton() + getCardSkeleton() + getCardSkeleton() + '</div>';
  }

  function getEmptyState(icon, title, desc, action) {
    var html = '<div class="empty-state">';
    html += '<div class="empty-state__icon">' + icon + '</div>';
    html += '<h3 class="empty-state__title">' + title + '</h3>';
    html += '<p class="empty-state__desc">' + desc + '</p>';
    if (action) html += '<button class="btn btn--primary mt-lg">' + action.label + '</button>';
    html += '</div>';
    return html;
  }

  return { getCardSkeleton, getTableSkeleton, getChartSkeleton, getStatsSkeleton, getEmptyState };
})();
