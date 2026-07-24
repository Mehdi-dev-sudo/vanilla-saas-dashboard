const TooltipWrapper = /* @__PURE__ */ (function() {
  function attach(el, text) {
    el.setAttribute("data-tooltip", text);
  }
  return { attach };
})();
