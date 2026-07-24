const ExportButton = /* @__PURE__ */ (function() {
  function create(containerId, opts) {
    var c = document.getElementById(containerId);
    if (!c) return null;
    var label = opts.label || "Export";
    var onExport = opts.onExport || null;
    var formats = opts.formats || ["csv", "json"];
    function render() {
      var h = '<div class="export-btn-group">';
      h += '<button class="btn btn--secondary" id="ebBtn">' + label + "</button>";
      h += '<div class="export-btn-group__menu" id="ebMenu" style="display:none;position:absolute;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);box-shadow:var(--shadow-lg);z-index:100;min-width:120px">';
      formats.forEach(function(fmt) {
        h += '<button class="export-btn-group__item" data-format="' + fmt + '" style="display:block;width:100%;padding:var(--space-sm) var(--space-md);border:none;background:none;cursor:pointer;text-align:left">.' + fmt.toUpperCase() + "</button>";
      });
      h += "</div></div>";
      c.innerHTML = h;
      var btn = c.querySelector("#ebBtn");
      var menu = c.querySelector("#ebMenu");
      if (btn) btn.addEventListener("click", function(e) {
        e.stopPropagation();
        if (menu) menu.style.display = menu.style.display === "none" ? "block" : "none";
      });
      c.querySelectorAll(".export-btn-group__item").forEach(function(item) {
        item.addEventListener("click", function() {
          if (menu) menu.style.display = "none";
          if (onExport) onExport(this.dataset.format);
        });
      });
      document.addEventListener("click", function() {
        if (menu) menu.style.display = "none";
      });
    }
    render();
    return {};
  }
  return { create };
})();
