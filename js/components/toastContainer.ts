/**
 * ToastContainer — Toast notification container.
 * @module ToastContainer
 */
const ToastContainer = (function () {
  function render() {
    return '<div class="toast-container" id="toastContainer" aria-live="polite" aria-atomic="true"></div>';
  }
  return { render: render };
})();