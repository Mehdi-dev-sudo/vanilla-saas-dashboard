function formatCurrency(amount) {
  return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function formatNumber(num) {
  return Number(num).toLocaleString('en-US');
}

function formatPercent(value) {
  return Number(value).toFixed(1) + '%';
}

function formatDate(dateStr) {
  var date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function  formatShortDate(dateStr) {
  var date = new Date(dateStr);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()] + ' ' + date.getDate();
}

function timeAgo(dateStr) {
  var now = new Date();
  var date = new Date(dateStr);
  var diffMs = now - date;
  var diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return diffMins + 'm ago';
  var diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return diffHours + 'h ago';
  var diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return diffDays + 'd ago';
  return formatShortDate(dateStr);
}

function stringToColor(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
  var colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#3b82f6','#ec4899','#14b8a6','#f97316','#06b6d4'];
  return colors[Math.abs(hash) % colors.length];
}

function generateId() {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function debounce(fn, delay) {
  var timer;
  return function () {
    var args = arguments;
    var context = this;
    clearTimeout(timer);
    timer = setTimeout(function () { fn.apply(context, args); }, delay);
  };
}

describe('Utility Functions', function () {

  describe('formatCurrency', function () {
    test('formats integer as currency', function () { expect(formatCurrency(1200)).toBe('$1,200'); });
    test('formats zero', function () { expect(formatCurrency(0)).toBe('$0'); });
    test('formats decimal', function () { expect(formatCurrency(1250.5)).toBe('$1,250.5'); });
    test('handles string input', function () { expect(formatCurrency('500')).toBe('$500'); });
  });

  describe('formatNumber', function () {
    test('formats thousands', function () { expect(formatNumber(1500)).toBe('1,500'); });
    test('formats millions', function () { expect(formatNumber(1000000)).toBe('1,000,000'); });
    test('formats zero', function () { expect(formatNumber(0)).toBe('0'); });
  });

  describe('formatPercent', function () {
    test('formats integer', function () { expect(formatPercent(12.5)).toBe('12.5%'); });
    test('formats zero', function () { expect(formatPercent(0)).toBe('0.0%'); });
    test('formats decimal', function () { expect(formatPercent(3.14159)).toBe('3.1%'); });
  });

  describe('formatDate', function () {
    test('formats date string', function () { expect(formatDate('2026-03-28')).toBe('Mar 28, 2026'); });
    test('handles ISO date', function () { expect(formatDate('2026-01-15T12:00:00Z')).toBe('Jan 15, 2026'); });
  });

  describe('formatShortDate', function () {
    test('formats short date', function () { expect(formatShortDate('2026-03-28')).toBe('Mar 28'); });
  });

  describe('timeAgo', function () {
    test('returns Just now for current time', function () { expect(timeAgo(new Date().toISOString())).toBe('Just now'); });
    test('returns m ago for recent time', function () {
      var fiveMinAgo = new Date(Date.now() - 300000).toISOString();
      expect(timeAgo(fiveMinAgo)).toBe('5m ago');
    });
    test('returns h ago for hours', function () {
      var threeHoursAgo = new Date(Date.now() - 10800000).toISOString();
      expect(timeAgo(threeHoursAgo)).toBe('3h ago');
    });
  });

  describe('stringToColor', function () {
    test('returns a hex color', function () { expect(stringToColor('test')).toMatch(/^#[0-9a-f]{6}$/); });
    test('same input returns same color', function () { expect(stringToColor('hello')).toBe(stringToColor('hello')); });
    test('different inputs may return different colors', function () {
      var colors = new Set([stringToColor('abc'), stringToColor('def'), stringToColor('ghi')]);
      expect(colors.size).toBeGreaterThan(1);
    });
  });

  describe('generateId', function () {
    test('returns a string starting with id-', function () { expect(generateId()).toMatch(/^id-/); });
    test('generates unique ids', function () { expect(generateId()).not.toBe(generateId()); });
  });

  describe('escapeHtml', function () {
    test('escapes < and >', function () { expect(escapeHtml('<script>')).toBe('&lt;script&gt;'); });
    test('escapes &', function () { expect(escapeHtml('a & b')).toBe('a &amp; b'); });
    test('passes through safe text', function () { expect(escapeHtml('hello world')).toBe('hello world'); });
  });

  describe('debounce', function () {
    jest.useFakeTimers();
    test('calls function after delay', function () {
      var fn = jest.fn();
      var debounced = debounce(fn, 300);
      debounced();
      expect(fn).not.toBeCalled();
      jest.advanceTimersByTime(300);
      expect(fn).toBeCalled();
    });
    test('calls function only once for multiple rapid calls', function () {
      var fn = jest.fn();
      var debounced = debounce(fn, 300);
      debounced();
      debounced();
      debounced();
      jest.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
