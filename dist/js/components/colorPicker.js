const ColorPicker = /* @__PURE__ */ (function() {
  var colors = [
    { id: "indigo", label: "Indigo", color: "#6366f1" },
    { id: "blue", label: "Blue", color: "#3b82f6" },
    { id: "green", label: "Green", color: "#10b981" },
    { id: "purple", label: "Purple", color: "#8b5cf6" },
    { id: "orange", label: "Orange", color: "#f59e0b" },
    { id: "red", label: "Red", color: "#ef4444" }
  ];
  function render(selected) {
    selected = selected || "indigo";
    var h = '<div class="color-picker">';
    colors.forEach(function(c) {
      h += '<button class="color-picker__swatch' + (c.id === selected ? " active" : "") + '" data-color="' + c.id + '" style="background:' + c.color + '" title="' + c.label + '" aria-label="' + c.label + '"></button>';
    });
    h += "</div>";
    return h;
  }
  function getColors() {
    return colors;
  }
  return { render, getColors };
})();
