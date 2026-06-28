const ToastSystem = (function () {
  const container = document.getElementById('toastContainer');

  function show(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;

    const icons = {
      success: '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
      error: '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.innerHTML =
      (icons[type] || icons.info) +
      '<span class="toast__message">' + message + '</span>' +
      '<button class="toast__close" aria-label="Dismiss">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>';

    el.querySelector('.toast__close').addEventListener('click', function () {
      dismiss(el);
    });

    container.appendChild(el);

    if (duration > 0) {
      setTimeout(() => dismiss(el), duration);
    }

    return el;
  }

  function dismiss(el) {
    if (el.classList.contains('toast--removing')) return;
    el.classList.add('toast--removing');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 300);
  }

  function success(message, duration) { return show(message, 'success', duration); }
  function error(message, duration) { return show(message, 'error', duration); }
  function warning(message, duration) { return show(message, 'warning', duration); }
  function info(message, duration) { return show(message, 'info', duration); }

  return { show, success, error, warning, info, dismiss };
})();
