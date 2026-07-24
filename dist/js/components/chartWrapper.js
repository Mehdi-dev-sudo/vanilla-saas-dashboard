const ChartWrapper = /* @__PURE__ */ (function() {
  function create(containerId, canvasId, config) {
    var c = document.getElementById(containerId);
    if (!c) return null;
    var height = config.height || 280;
    c.innerHTML = '<div class="chart-wrapper"><canvas id="' + canvasId + '" height="' + height + '"></canvas></div>';
    var canvas = c.querySelector("#" + canvasId);
    function getCanvas() {
      return canvas;
    }
    return { getCanvas, el: c };
  }
  return { create };
})();
