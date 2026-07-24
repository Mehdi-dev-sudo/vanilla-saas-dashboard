const ConfirmDialog = /* @__PURE__ */ (function() {
  function show(title, message, confirmText, cancelText, onConfirm, onCancel) {
    confirmText = confirmText || "Confirm";
    cancelText = cancelText || "Cancel";
    if (typeof ModalSystem !== "undefined") {
      ModalSystem.confirm(title, message, confirmText, cancelText, onConfirm, onCancel);
    } else {
      if (window.confirm(message)) {
        if (onConfirm) onConfirm();
      } else {
        if (onCancel) onCancel();
      }
    }
  }
  return { show };
})();
