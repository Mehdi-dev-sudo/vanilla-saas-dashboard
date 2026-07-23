const ActivityLog = (function() {
  const STORAGE_KEY = "saas_activity_log";
  const MAX_ENTRIES = 100;
  let entries = load();
  function load() {
    var data = SafeStorage.getItem(STORAGE_KEY);
    try {
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }
  function save() {
    SafeStorage.setObject(STORAGE_KEY, entries);
  }
  function add(action, detail, type) {
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      action,
      detail: detail || "",
      type: type || "info",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    entries.unshift(entry);
    if (entries.length > MAX_ENTRIES) entries.pop();
    save();
    return entry;
  }
  function getAll() {
    return entries;
  }
  function getRecent(count) {
    return entries.slice(0, count || 10);
  }
  function clear() {
    entries = [];
    save();
  }
  function formatTime(isoString) {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const mins = date.getMinutes().toString().padStart(2, "0");
    return hours + ":" + mins;
  }
  function formatDate(isoString) {
    const date = new Date(isoString);
    const now = /* @__PURE__ */ new Date();
    const diff = now - date;
    if (diff < 6e4) return "Just now";
    if (diff < 36e5) return Math.floor(diff / 6e4) + "m ago";
    if (diff < 864e5) return Math.floor(diff / 36e5) + "h ago";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  const typeIcons = {
    user: "user-plus",
    delete: "trash-2",
    edit: "edit",
    export: "download",
    theme: "sun",
    create: "plus-circle",
    undo: "rotate-ccw",
    redo: "rotate-cw",
    auth: "log-in",
    info: "info"
  };
  function getIcon(type) {
    return typeIcons[type] || "info";
  }
  return { add, getAll, getRecent, clear, formatTime, formatDate, getIcon };
})();
