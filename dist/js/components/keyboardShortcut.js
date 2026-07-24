const KeyboardShortcut = (function() {
  var handlers = [];
  function register(key, ctrl, shift, handler) {
    handlers.push({ key, ctrl, shift, handler });
  }
  function init() {
    document.addEventListener("keydown", function(e) {
      handlers.forEach(function(h) {
        if (e.key === h.key && e.ctrlKey === !!h.ctrl && e.shiftKey === !!h.shift) {
          e.preventDefault();
          h.handler(e);
        }
      });
    });
  }
  function clear() {
    handlers = [];
  }
  init();
  return { register, clear };
})();
