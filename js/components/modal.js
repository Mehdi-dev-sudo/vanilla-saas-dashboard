const ModalSystem = (function () {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  let isOpen = false;

  function init() {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  function open(html) {
    content.innerHTML = html;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    isOpen = true;
    document.body.style.overflow = 'hidden';

    content.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', close);
    });
  }

  function close() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    isOpen = false;
    document.body.style.overflow = '';
  }

  function confirm(title, message, confirmText, cancelText, onConfirm) {
    confirmText = confirmText || 'Confirm';
    cancelText = cancelText || 'Cancel';

    const html =
      '<div class="modal__header">' +
        '<h3 class="modal__title">' + title + '</h3>' +
        '<button class="modal__close" data-modal-close aria-label="Close">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="modal__body">' +
        '<p style="color: var(--text-secondary);">' + message + '</p>' +
      '</div>' +
      '<div class="modal__footer">' +
        '<button class="btn btn--secondary" data-modal-close>' + cancelText + '</button>' +
        '<button class="btn btn--danger" id="confirmBtn">' + confirmText + '</button>' +
      '</div>';

    open(html);

    document.getElementById('confirmBtn').addEventListener('click', function () {
      if (typeof onConfirm === 'function') onConfirm();
      close();
    });
  }

  function form(title, formHtml, submitText, onSubmit) {
    submitText = submitText || 'Save';
    const html =
      '<div class="modal__header">' +
        '<h3 class="modal__title">' + title + '</h3>' +
        '<button class="modal__close" data-modal-close aria-label="Close">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<form id="modalForm" class="modal__body">' + formHtml + '</form>' +
      '<div class="modal__footer">' +
        '<button class="btn btn--secondary" data-modal-close>Cancel</button>' +
        '<button class="btn btn--primary" type="submit" form="modalForm">' + submitText + '</button>' +
      '</div>';

    open(html);

    const form = document.getElementById('modalForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = {};
      new FormData(form).forEach((value, key) => { data[key] = value; });
      if (typeof onSubmit === 'function') onSubmit(data);
    });
  }

  return { init, open, close, confirm, form };
})();
