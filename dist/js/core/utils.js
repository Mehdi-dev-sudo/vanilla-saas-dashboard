const Utils = {
  formatCurrency(amount) {
    var n = Number(amount);
    if (isNaN(n)) return "$0";
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  },
  formatNumber(num) {
    var n = Number(num);
    if (isNaN(n)) return "0";
    return n.toLocaleString("en-US");
  },
  formatPercent(value) {
    var n = Number(value);
    if (isNaN(n)) return "0.0%";
    return n.toFixed(1) + "%";
  },
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  },
  formatShortDate(dateStr) {
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[date.getMonth()] + " " + date.getDate();
  },
  timeAgo(dateStr) {
    const now = /* @__PURE__ */ new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 6e4);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return diffMins + "m ago";
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return diffHours + "h ago";
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return diffDays + "d ago";
    return this.formatShortDate(dateStr);
  },
  debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },
  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML.replace(/'/g, "&#39;");
  },
  stringToColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4"];
    return colors[Math.abs(hash) % colors.length];
  },
  generateId() {
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
  },
  animateValue(el, start, end, duration) {
    if (!el) return;
    if (!el.offsetParent) {
      el.textContent = end;
      return;
    }
    duration = duration || 1e3;
    const range = end - start;
    const startTime = performance.now();
    function update(currentTime) {
      if (!el) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + range * eased);
      const text = Number.isInteger(end) ? Math.round(current) : current.toFixed(1);
      el.textContent = text;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  },
  animatePercent(el, start, end, duration, suffix) {
    if (!el) return;
    if (!el.offsetParent) {
      el.textContent = end + "%";
      return;
    }
    suffix = suffix || "%";
    duration = duration || 1e3;
    const range = end - start;
    const startTime = performance.now();
    function update(currentTime) {
      if (!el) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + range * eased;
      el.textContent = current.toFixed(1) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  },
  copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        if (typeof ToastSystem !== "undefined") ToastSystem.success("Copied: " + text);
      }).catch(function() {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }
};
var SafeStorage = {
  _quotaNotified: false,
  getItem: function(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: function(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (e.name === "QuotaExceededError" || e.code === 22 || e.number === -2147024882) {
        if (!SafeStorage._quotaNotified) {
          SafeStorage._quotaNotified = true;
          if (typeof ToastSystem !== "undefined") {
            ToastSystem.error("Storage quota exceeded. Data may not be saved.");
          }
        }
      }
    }
  },
  removeItem: function(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
    }
  },
  getObject: function(key) {
    try {
      var data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  setObject: function(key, obj) {
    this.setItem(key, JSON.stringify(obj));
  }
};
function fallbackCopy(text) {
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    if (typeof ToastSystem !== "undefined") ToastSystem.success("Copied: " + text);
  } catch (e) {
    if (typeof ToastSystem !== "undefined") ToastSystem.error("Failed to copy");
  }
  document.body.removeChild(ta);
}
window.copyToClipboard = Utils.copyToClipboard;
