/**
 * ProgressBar — Progress indicator component.
 * @module ProgressBar
 */
const ProgressBar = (function () {
  function render(value, max, label) {
    value = value || 0;
    max = max || 100;
    var pct = Math.min(100, Math.round(value / max * 100));
    return '<div class="progress-bar"><div class="progress-bar__fill" style="width:' + pct + '%"></div>' + (label ? '<span class="progress-bar__label">' + label + '</span>' : '') + '<span class="progress-bar__value">' + pct + '%</span></div>';
  }
  return { render: render };
})();