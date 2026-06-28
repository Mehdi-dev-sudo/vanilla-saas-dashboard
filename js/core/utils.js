const Utils = {
  formatCurrency(amount) {
    return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  },

  formatNumber(num) {
    return Number(num).toLocaleString('en-US');
  },

  formatPercent(value) {
    return Number(value).toFixed(1) + '%';
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  formatShortDate(dateStr) {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate();
  },

  timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return diffHours + 'h ago';
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return diffDays + 'd ago';
    return this.formatShortDate(dateStr);
  },

  debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  generateId() {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
  },

  animateValue(el, start, end, duration) {
    duration = duration || 1000;
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + range * eased);
      const text = Number.isInteger(end) ? current : current.toFixed(1);
      el.textContent = text;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  },

  animatePercent(el, start, end, duration, suffix) {
    suffix = suffix || '%';
    duration = duration || 1000;
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (start + range * eased);
      el.textContent = current.toFixed(1) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }
};
