/**
 * StateRenderer — Consistent state management for data views.
 * Provides loading, empty, error, and retry patterns.
 * @module StateRenderer
 */
const StateRenderer = (function () {
  var ASYNC_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    LOADED: 'loaded',
    EMPTY: 'empty',
    FILTERED_EMPTY: 'filtered_empty',
    ERROR: 'error'
  };

  function loading(type) {
    switch (type) {
      case 'stats': return SkeletonLoader.getStatsSkeleton();
      case 'chart': return SkeletonLoader.getChartSkeleton();
      case 'table': return SkeletonLoader.getTableSkeleton(5);
      case 'card': return SkeletonLoader.getCardSkeleton();
      case 'text': return '<div class="skeleton skeleton--text skeleton--w-60"></div><div class="skeleton skeleton--text skeleton--w-40" style="margin-top:8px"></div>';
      default: return '<div class="page-loader" style="display:flex"><div class="spinner"></div></div>';
    }
  }

  function empty(icon, title, desc, action) {
    return SkeletonLoader.getEmptyState(icon, title, desc, action);
  }

  function filteredEmpty(searchTerm, filterLabel, colspan) {
    colspan = colspan || 8;
    var filterMsg = filterLabel ? ' with the current filter' : '';
    var searchMsg = searchTerm ? ' for "' + searchTerm + '"' : '';
    return '<tr><td colspan="' + colspan + '"><div class="empty-state"><div class="empty-state__icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div><p class="empty-state__text">No results found' + searchMsg + filterMsg + '</p><p class="empty-state__hint">Try adjusting your search or filter criteria</p></div></td></tr>';
  }

  function error(message, onRetryId, colspan) {
    colspan = colspan || 8;
    var retryHtml = onRetryId ? '<button class="btn btn--primary mt-md" data-retry="' + onRetryId + '">Retry</button>' : '';
    return '<tr><td colspan="' + colspan + '"><div class="empty-state"><div class="empty-state__icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--clr-danger)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><p class="empty-state__text">Failed to load data</p><p class="empty-state__hint">' + (message || 'An unexpected error occurred') + '</p>' + retryHtml + '</div></td></tr>';
  }

  function createDataView(config) {
    var state = ASYNC_STATES.IDLE;
    var data = null;
    var errorMsg = '';
    var subscriptions = [];

    function setState(newState) {
      state = newState;
      if (config.onStateChange) config.onStateChange(state);
    }

    function load() {
      setState(ASYNC_STATES.LOADING);
      if (config.renderLoading) config.renderLoading();

      var promise = config.fetch();
      if (!promise || typeof promise.then !== 'function') {
        setState(ASYNC_STATES.LOADED);
        data = promise;
        if (config.renderLoaded) config.renderLoaded(data);
        return;
      }

      promise.then(function (result) {
        data = result;
        if (!result || (Array.isArray(result) && result.length === 0)) {
          setState(ASYNC_STATES.EMPTY);
          if (config.renderEmpty) config.renderEmpty();
        } else if (config.isEmpty && config.isEmpty(result)) {
          setState(ASYNC_STATES.EMPTY);
          if (config.renderEmpty) config.renderEmpty();
        } else {
          setState(ASYNC_STATES.LOADED);
          if (config.renderLoaded) config.renderLoaded(result);
        }
      }).catch(function (err) {
        errorMsg = err && err.message ? err.message : 'An error occurred';
        setState(ASYNC_STATES.ERROR);
        if (config.renderError) config.renderError(errorMsg);
      });
    }

    function retry() {
      load();
    }

    function destroy() {
      subscriptions.forEach(function (fn) { if (typeof fn === 'function') fn(); });
      subscriptions = [];
    }

    return { load: load, retry: retry, destroy: destroy, getState: function () { return state; }, getData: function () { return data; } };
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-retry]');
    if (btn) {
      var retryFn = window[btn.getAttribute('data-retry')];
      if (typeof retryFn === 'function') retryFn();
    }
  });

  return { ASYNC_STATES: ASYNC_STATES, loading: loading, empty: empty, filteredEmpty: filteredEmpty, error: error, createDataView: createDataView };
})();
