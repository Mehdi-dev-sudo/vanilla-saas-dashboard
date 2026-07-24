const Avatar = /* @__PURE__ */ (function() {
  function render(name, size) {
    size = size || 32;
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colors = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];
    var bg = colors[Math.abs(hash) % colors.length];
    var initials = name.split(" ").map(function(s) {
      return s.charAt(0).toUpperCase();
    }).slice(0, 2).join("");
    return '<div class="avatar" style="width:' + size + "px;height:" + size + "px;background:" + bg + ";color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:" + Math.round(size * 0.4) + 'px;font-weight:600;flex-shrink:0" title="' + name + '">' + initials + "</div>";
  }
  return { render };
})();
