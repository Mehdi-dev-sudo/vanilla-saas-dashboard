/**
 * ChartEngine — Canvas-based chart rendering with DPR scaling and animation.
 * @module ChartEngine
 */
const ChartEngine = (function () {
  let dpr = 1;
  let animFrames = [];
  let cachedStyles = null;
  var canvasCache = {};

  function init() {
    dpr = window.devicePixelRatio || 1;
    cachedStyles = null;
    canvasCache = {};
    window.addEventListener('resize', resize);
  }

function getCanvasStyles() {
  if (cachedStyles) return cachedStyles;
  const s = getComputedStyle(document.documentElement);
  cachedStyles = {
    primary: s.getPropertyValue('--clr-primary').trim() || '#6366f1',
    secondary: s.getPropertyValue('--clr-secondary').trim() || '#8b5cf6',
    grid: s.getPropertyValue('--chart-grid').trim() || '#e5e7eb',
    text: s.getPropertyValue('--chart-text').trim() || '#9ca3af',
    lineFill: s.getPropertyValue('--chart-line-fill').trim() || 'rgba(99,102,241,0.15)',
    textPrimary: s.getPropertyValue('--text-primary').trim() || '#111827'
  };
  return cachedStyles;
}

function setupCanvas(canvas, width, height) {
  if (!canvas || !canvas.getContext) return { ctx: null, w: 0, h: 0 };
  var id = canvas.id;
  var cache = canvasCache[id];
  var rect = canvas.getBoundingClientRect();
  var parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 600;
  var w = width || rect.width || parentW;
  var h = height || rect.height || 300;
  if (cache && cache.w === w && cache.h === h) {
    return { ctx: cache.ctx, w: w, h: h };
  }
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  canvasCache[id] = { ctx: ctx, w: w, h: h };
  return { ctx: ctx, w: w, h: h };
  }

  /* ---------- Line Chart ---------- */
  function drawLineChart(canvasId, data, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const colors = getCanvasStyles();
    const { ctx, w, h } = setupCanvas(canvas, null, options.height || 300);
    if (!ctx) return;

    const pad = { top: 20, right: 20, bottom: 40, left: 55 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;
    const values = data.map(d => d.value);
    const min = Math.min(...values) * 0.9;
    const max = Math.max(...values) * 1.05;
    const xStep = chartW / (data.length - 1);

    function getX(i) { return pad.left + i * xStep; }
    function getY(v) { return pad.top + chartH - ((v - min) / (max - min)) * chartH; }

    function drawGrid() {
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for (let i = 0; i <= 5; i++) {
        const y = pad.top + (chartH / 5) * i;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    function drawLabels() {
      ctx.fillStyle = colors.text;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      data.forEach((d, i) => {
        ctx.fillText(d.month || d.label || '', getX(i), h - pad.bottom + 10);
      });

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let i = 0; i <= 5; i++) {
        const v = min + ((max - min) / 5) * i;
        const y = pad.top + (chartH / 5) * i;
        ctx.fillText((options.prefix || '') + Math.round(v / (options.divisor || 1)) + (options.suffix || ''), pad.left - 8, y);
      }
    }

    function drawLine(progress) {
      const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
      gradient.addColorStop(0, colors.lineFill);
      gradient.addColorStop(1, 'transparent');

      const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
      const count = Math.max(2, Math.floor(points.length * progress));

      ctx.beginPath();
      ctx.moveTo(points[0].x, pad.top + chartH);
      for (let i = 0; i < count; i++) {
        const p = points[i];
        if (i === 0) ctx.lineTo(p.x, p.y);
        else {
          const prev = points[i - 1];
          const cpx = (prev.x + p.x) / 2;
          ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
        }
      }
      const lastX = points[Math.min(count, points.length - 1)].x;
      ctx.lineTo(lastX, pad.top + chartH);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const p = points[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else {
          const prev = points[i - 1];
          const cpx = (prev.x + p.x) / 2;
          ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
        }
      }
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 3;
      ctx.stroke();

      for (let i = 0; i < count; i++) {
        const p = points[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    drawGrid();
    drawLabels();
    startAnimation(canvas, function (progress) {
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      drawLabels();
      drawLine(progress);
    });
  }

  /* ---------- Bar Chart ---------- */
  function drawBarChart(canvasId, data, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const colors = getCanvasStyles();
    const { ctx, w, h } = setupCanvas(canvas, null, options.height || 300);
    if (!ctx) return;

    const pad = { top: 20, right: 20, bottom: 40, left: 55 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;
    const values = data.map(d => d.value);
    const max = Math.max(...values) * 1.15;
    const barCount = data.length;
    const barW = Math.min((chartW / barCount) * 0.55, 48);
    const gap = (chartW - barW * barCount) / (barCount + 1);

    function drawGrid() {
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(w - pad.right, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    function drawLabels() {
      ctx.fillStyle = colors.text;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      data.forEach((d, i) => {
        ctx.fillText(d.month || d.label || '', pad.left + gap + i * (barW + gap) + barW / 2, h - pad.bottom + 10);
      });

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let i = 0; i <= 4; i++) {
        const v = Math.round((max / 4) * i);
        const y = pad.top + (chartH / 4) * i;
        ctx.fillText(v, pad.left - 8, y);
      }
    }

    function drawBars(progress) {
      data.forEach((d, i) => {
        const x = pad.left + gap + i * (barW + gap);
        const barH = ((d.value / max) * chartH) * progress;
        const y = pad.top + chartH - barH;

        const gradient = ctx.createLinearGradient(x, y, x, pad.top + chartH);
        gradient.addColorStop(0, colors.primary);
        gradient.addColorStop(1, colors.secondary);

        ctx.beginPath();
        const r = Math.min(4, barW / 4);
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, pad.top + chartH);
        ctx.lineTo(x, pad.top + chartH);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    }

    drawGrid();
    drawLabels();
    startAnimation(canvas, function (progress) {
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      drawLabels();
      drawBars(progress);
    });
  }

  /* ---------- Donut Chart ---------- */
  function drawDonutChart(canvasId, data, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const colors = getCanvasStyles();
    const { ctx, w, h } = setupCanvas(canvas, options.size || 200, options.size || 200);
    if (!ctx) return;

    const cx = w / 2;
    const cy = h / 2;
    const outerR = (options.size || 200) / 2 - 20;
    const innerR = outerR * 0.62;
    const total = data.reduce((s, d) => s + d.value, 0);

    function draw() {
      let startAngle = -Math.PI / 2;
      data.forEach(function (d) {
        const sliceAngle = (d.value / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
        ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = d.color;
        ctx.fill();
        startAngle += sliceAngle;
      });

      ctx.fillStyle = colors.text;
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typeof I18n !== 'undefined' ? I18n.__('chart.total') : 'Total', cx, cy - 12);
      ctx.fillStyle = colors.textPrimary;
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText(total + '%', cx, cy + 14);
    }

    draw();

    if (options.renderLegend) {
      options.renderLegend(data);
    }
  }

  function startAnimation(canvas, drawFrame) {
    const duration = 900;
    const startTime = performance.now();
    var canvasFrames = canvas._animFrames || [];
    canvasFrames.forEach(function (id) { cancelAnimationFrame(id); });

    function frame(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      drawFrame(eased);
      if (progress < 1) {
        canvas._animFrames = [requestAnimationFrame(frame)];
      } else {
        canvas._animFrames = [];
      }
    }

    canvas._animFrames = [requestAnimationFrame(frame)];
  }

  function resize() {
    cachedStyles = null;
    canvasCache = {};
    if (typeof DashboardPage !== 'undefined') DashboardPage.reinitCharts();
    if (typeof AnalyticsPage !== 'undefined') AnalyticsPage.reinitCharts();
  }

  function downloadChart(canvasId, filename) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) { ToastSystem.error('Chart not found'); return; }
    var link = document.createElement('a');
    link.download = filename || 'chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof ActivityLog !== 'undefined') ActivityLog.add('export', 'Downloaded chart: ' + filename, 'export');
    ToastSystem.success('Chart downloaded');
  }

  function destroy() {
    window.removeEventListener('resize', resize);
    cachedStyles = null;
    canvasCache = {};
  }

  return { init, drawLineChart, drawBarChart, drawDonutChart, resize, downloadChart, destroy };
})();
