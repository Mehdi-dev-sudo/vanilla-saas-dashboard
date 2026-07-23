PluginSystem.register('perfMonitor', {
  panel: null,
  fps: 0,
  frames: 0,
  lastTime: 0,
  dataPoints: [],
  interval: null,
  rafId: null,

  onRegister: function () {
    this.createPanel();
    this.startMonitoring();
    this.addCommandPaletteEntry();
  },

  onUnregister: function () {
    if (this.interval) clearInterval(this.interval);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.panel) this.panel.remove();
  },

  createPanel: function () {
    this.panel = document.createElement('div');
    this.panel.id = 'perfMonitor';
    this.panel.style.cssText = [
      'position:fixed;bottom:60px;right:16px;width:260px;background:#1a1b2e;border:1px solid rgba(255,255,255,0.1);',
      'border-radius:8px;padding:12px;z-index:2999;color:#e2e8f0;font-family:monospace;font-size:12px;',
      'display:none;box-shadow:0 4px 24px rgba(0,0,0,0.3);'
    ].join('');
    this.panel.innerHTML = [
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px">',
        '<span style="font-weight:600;text-transform:uppercase;letter-spacing:0.05em;font-size:10px;color:#94a3b8">Performance Monitor</span>',
        '<button id="perfToggle" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px">&times;</button>',
      '</div>',
      '<div id="perfMiniGraph" style="height:40px;margin-bottom:8px;position:relative;background:rgba(255,255,255,0.03);border-radius:4px;overflow:hidden"></div>',
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">',
        '<div>FPS: <span id="perfFps" style="font-weight:700;color:#10b981">0</span></div>',
        '<div>Memory: <span id="perfMemory" style="font-weight:700">0 MB</span></div>',
        '<div>DOM: <span id="perfDom" style="font-weight:700">0</span></div>',
        '<div>Storage: <span id="perfStorage" style="font-weight:700">0</span></div>',
      '</div>'
    ].join('');
    document.body.appendChild(this.panel);

    var perfToggle = document.getElementById('perfToggle');
    if (perfToggle) perfToggle.addEventListener('click', function () {
      var perfMon = document.getElementById('perfMonitor');
      if (perfMon) perfMon.style.display = 'none';
    });

    var self = this;
    PluginSystem.on('command:togglePerfMonitor', function () {
      self.toggle();
    });
  },

  toggle: function () {
    if (!this.panel) return;
    var display = this.panel.style.display;
    this.panel.style.display = display === 'none' || display === '' ? 'block' : 'none';
  },

  addCommandPaletteEntry: function () {
    var cmdRegistry = window.CommandRegistry;
    if (cmdRegistry && cmdRegistry.add) {
      cmdRegistry.add({
        id: 'toggle-perf-monitor',
        title: 'Toggle Performance Monitor',
        category: 'developer',
        icon: 'activity',
        keywords: ['perf', 'performance', 'fps', 'monitor'],
        action: function () { PluginSystem.emit('command:togglePerfMonitor'); }
      });
    }
  },

  startMonitoring: function () {
    this.lastTime = performance.now();
    var self = this;
    function frame(time) {
      self.frames++;
      if (time - self.lastTime >= 1000) {
        self.fps = self.frames;
        self.frames = 0;
        self.lastTime = time;
        self.dataPoints.push(self.fps);
        if (self.dataPoints.length > 60) self.dataPoints.shift();
      }
      self.rafId = requestAnimationFrame(frame);
    }
    this.rafId = requestAnimationFrame(frame);

    this.interval = setInterval(function () {
      self.updateDisplay();
    }, 1000);
  },

  updateDisplay: function () {
    var fpsEl = document.getElementById('perfFps');
    if (fpsEl) {
      fpsEl.textContent = this.fps;
      fpsEl.style.color = this.fps >= 50 ? '#10b981' : this.fps >= 30 ? '#f59e0b' : '#ef4444';
    }

    if (performance.memory) {
      var memEl = document.getElementById('perfMemory');
      if (memEl) memEl.textContent = Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB';
    }

    var domEl = document.getElementById('perfDom');
    if (domEl) domEl.textContent = document.getElementsByTagName('*').length;

    var storageEl = document.getElementById('perfStorage');
    if (storageEl) {
      var total = 0;
      for (var key in localStorage) {
        if (localStorage.hasOwnProperty(key)) total += localStorage[key].length * 2;
      }
      storageEl.textContent = total > 1024 ? (total / 1024).toFixed(1) + ' KB' : total + ' B';
    }

    this.drawGraph();
  },

  drawGraph: function () {
    var graph = document.getElementById('perfMiniGraph');
    if (!graph || this.dataPoints.length < 2) return;
    var w = graph.clientWidth || 256;
    var h = graph.clientHeight || 40;
    var max = Math.max(60, Math.max.apply(null, this.dataPoints));
    var step = w / (this.dataPoints.length - 1);
    var points = this.dataPoints.map(function (v, i) {
      var x = i * step;
      var y = h - (v / max) * h;
      return x + ',' + y;
    }).join(' ');
    graph.innerHTML = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><polyline points="' + points + '" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
});
