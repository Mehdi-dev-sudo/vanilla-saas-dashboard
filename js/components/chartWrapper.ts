/**
 * ChartWrapper — Chart canvas wrapper with auto-resize.
 * @module ChartWrapper
 */
const ChartWrapper = (function () {
  function create(containerId, canvasId, config) {
    var c = document.getElementById(containerId);
    if (!c) return null;
    var height = config.height || 280;
    c.innerHTML = '<div class="chart-wrapper"><canvas id="' + canvasId + '" height="' + height + '"></canvas></div>';
    var canvas = c.querySelector('#' + canvasId);
    function getCanvas() { return canvas; }
    return { getCanvas: getCanvas, el: c };
  }
  return { create: create };
})();