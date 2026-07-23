/**
 * PluginSystem — Plugin lifecycle management with register, init, and hooks.
 * @module PluginSystem
 */
var PluginSystem = (function () {
  var plugins = {};
  var hooks = {};

  function register(name, plugin) {
    if (plugins[name]) { console.warn('Plugin "' + name + '" already registered'); return; }
    plugins[name] = plugin;
    if (typeof plugin.onRegister === 'function') plugin.onRegister();
    emit('plugin:registered', { name: name });
    return true;
  }

  function unregister(name) {
    if (!plugins[name]) return false;
    if (typeof plugins[name].onUnregister === 'function') plugins[name].onUnregister();
    delete plugins[name];
    emit('plugin:unregistered', { name: name });
    return true;
  }

  function get(name) { return plugins[name] || null; }

  function getAll() { return Object.keys(plugins); }

  function on(event, fn) {
    if (!hooks[event]) hooks[event] = [];
    hooks[event].push(fn);
    return function () { hooks[event] = hooks[event].filter(function (h) { return h !== fn; }); };
  }

  function emit(event, data) {
    (hooks[event] || []).forEach(function (fn) { fn(data); });
  }

  function loadFromUrl(url) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = url;
      script.onload = function () { resolve(url); };
      script.onerror = function () { reject(new Error('Failed to load ' + url)); };
      document.body.appendChild(script);
    });
  }

  function discover() {
    return fetch('plugins/').then(function () {
      console.warn('Plugin discovery requires a server; load plugins manually via PluginSystem.loadFromUrl()');
    }).catch(function () {
      console.warn('No plugin directory found; load plugins manually');
    });
  }

  function init() {
    console.info('PluginSystem ready. Use PluginSystem.register(name, { ... }) to add plugins.');
  }

  return {
    init: init,
    register: register,
    unregister: unregister,
    get: get,
    getAll: getAll,
    on: on,
    emit: emit,
    loadFromUrl: loadFromUrl,
    discover: discover
  };
})();
