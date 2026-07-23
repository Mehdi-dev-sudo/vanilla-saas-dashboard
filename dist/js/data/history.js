const HistoryManager = /* @__PURE__ */ (function() {
  const MAX_HISTORY = 50;
  let undoStack = [];
  let redoStack = [];
  let isRestoring = false;
  function init() {
    document.addEventListener("keydown", function(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    });
  }
  function pushSnapshot() {
    if (isRestoring) return;
    const snapshot = {
      users: JSON.parse(JSON.stringify(AppStore.getState("users"))),
      transactions: JSON.parse(JSON.stringify(AppStore.getState("transactions")))
    };
    undoStack.push(snapshot);
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack = [];
  }
  function undo() {
    if (undoStack.length === 0) {
      ToastSystem.warning("Nothing to undo");
      return;
    }
    const current = {
      users: JSON.parse(JSON.stringify(AppStore.getState("users"))),
      transactions: JSON.parse(JSON.stringify(AppStore.getState("transactions")))
    };
    redoStack.push(current);
    const snapshot = undoStack.pop();
    isRestoring = true;
    AppStore.setState("users", snapshot.users);
    AppStore.setState("transactions", snapshot.transactions);
    isRestoring = false;
    ActivityLog.add("Undo", "Undo last action", "undo");
    ToastSystem.info("Undo successful");
  }
  function redo() {
    if (redoStack.length === 0) {
      ToastSystem.warning("Nothing to redo");
      return;
    }
    const current = {
      users: JSON.parse(JSON.stringify(AppStore.getState("users"))),
      transactions: JSON.parse(JSON.stringify(AppStore.getState("transactions")))
    };
    undoStack.push(current);
    const snapshot = redoStack.pop();
    isRestoring = true;
    AppStore.setState("users", snapshot.users);
    AppStore.setState("transactions", snapshot.transactions);
    isRestoring = false;
    ActivityLog.add("Redo", "Redo last action", "redo");
    ToastSystem.info("Redo successful");
  }
  function getUndoCount() {
    return undoStack.length;
  }
  function getRedoCount() {
    return redoStack.length;
  }
  return { init, pushSnapshot, undo, redo, getUndoCount, getRedoCount };
})();
