/**
 * TooltipWrapper — Tooltip helper component.
 * @module TooltipWrapper
 */
const TooltipWrapper = (function () {
  function attach(el, text) {
    el.setAttribute('data-tooltip', text);
  }
  return { attach: attach };
})();