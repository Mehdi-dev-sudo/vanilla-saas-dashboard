const Badge = /* @__PURE__ */ (function() {
  function render(text, type) {
    type = type || "default";
    return '<span class="badge badge--' + type + '">' + text + "</span>";
  }
  return { render };
})();
