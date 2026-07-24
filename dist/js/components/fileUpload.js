const FileUpload = /* @__PURE__ */ (function() {
  function create(containerId, opts) {
    var c = document.getElementById(containerId);
    if (!c) return null;
    var accept = opts.accept || ".json";
    var onFile = opts.onFile || null;
    var label = opts.label || "Drop file here or click to browse";
    function render() {
      c.innerHTML = '<div class="file-upload" id="fuZone"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><p>' + label + '</p><input type="file" id="fuInput" accept="' + accept + '" style="display:none"></div>';
      var zone = c.querySelector("#fuZone");
      var input = c.querySelector("#fuInput");
      if (zone) {
        zone.addEventListener("click", function() {
          if (input) input.click();
        });
        zone.addEventListener("dragover", function(e) {
          e.preventDefault();
          zone.classList.add("file-upload--dragover");
        });
        zone.addEventListener("dragleave", function() {
          zone.classList.remove("file-upload--dragover");
        });
        zone.addEventListener("drop", function(e) {
          e.preventDefault();
          zone.classList.remove("file-upload--dragover");
          if (e.dataTransfer.files && e.dataTransfer.files[0] && onFile) onFile(e.dataTransfer.files[0]);
        });
      }
      if (input) input.addEventListener("change", function() {
        if (this.files && this.files[0] && onFile) onFile(this.files[0]);
        this.value = "";
      });
    }
    render();
    return {};
  }
  return { create };
})();
