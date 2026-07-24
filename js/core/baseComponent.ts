/**
 * BaseComponent — Standard lifecycle for all page components.
 * Provides consistent render/init/cleanup pattern with state management.
 * @module BaseComponent
 */
const BaseComponent = (function () {
  var instanceId = 0;

  function create(config) {
    var id = 'bc-' + (++instanceId);
    var state = {};
    var cleanups = [];
    var inited = false;

    function render(props) {
      if (typeof config.render === 'function') {
        return config.render(state, props || {});
      }
      return '';
    }

    function init(container) {
      if (inited) return;
      inited = true;
      if (typeof config.init === 'function') {
        var cleanup = config.init(state);
        if (typeof cleanup === 'function') cleanups.push(cleanup);
      }
    }

    function setState(updates) {
      var changed = false;
      for (var key in updates) {
        if (updates.hasOwnProperty(key) && state[key] !== updates[key]) {
          state[key] = updates[key];
          changed = true;
        }
      }
      if (changed && typeof config.onStateChange === 'function') {
        config.onStateChange(state);
      }
      return changed;
    }

    function getState(key) {
      return key ? state[key] : state;
    }

    function destroy() {
      cleanups.forEach(function (fn) { if (typeof fn === 'function') fn(); });
      cleanups = [];
      inited = false;
      if (typeof config.onDestroy === 'function') config.onDestroy();
    }

    return { id: id, render: render, init: init, destroy: destroy, setState: setState, getState: getState };
  }

  return { create: create };
})();
