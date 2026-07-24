/**
 * Pagination — Reusable pagination component.
 * @module Pagination
 */
const Pagination = (function () {
  function create(containerId, opts) {
    var c = document.getElementById(containerId);
    if (!c) return null;
    var page = opts.page || 1;
    var total = opts.totalPages || 1;
    var onChange = opts.onChange || null;
    function render() {
      var h = '<div class="pagination">';
      h += '<button class="pagination__btn" id="pgPrev"' + (page <= 1 ? ' disabled' : '') + '>' + prevIcon() + '</button>';
      h += '<span class="pagination__info">Page ' + page + ' of ' + total + '</span>';
      for (var i = 1; i <= total; i++) {
        h += '<button class="pagination__btn' + (i === page ? ' active' : '') + '" data-pg-page="' + i + '">' + i + '</button>';
      }
      h += '<button class="pagination__btn" id="pgNext"' + (page >= total ? ' disabled' : '') + '>' + nextIcon() + '</button>';
      h += '</div>';
      c.innerHTML = h;
      bindEvents();
    }
    function bindEvents() {
      var prev = c.querySelector('#pgPrev');
      if (prev) prev.addEventListener('click', function () {
        if (page > 1) { page--; render(); if (onChange) onChange(page); }
      });
      var next = c.querySelector('#pgNext');
      if (next) next.addEventListener('click', function () {
        if (page < total) { page++; render(); if (onChange) onChange(page); }
      });
      c.querySelectorAll('[data-pg-page]').forEach(function (b) {
        b.addEventListener('click', function () {
          page = parseInt(this.dataset.pgPage);
          render();
          if (onChange) onChange(page);
        });
      });
    }
    function prevIcon() {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';
    }
    function nextIcon() {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
    }
    function setPage(p) { page = p; render(); }
    render();
    return { setPage: setPage };
  }
  return { create: create };
})();