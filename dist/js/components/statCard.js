const StatCard = /* @__PURE__ */ (function() {
  function create(config) {
    var label = config.label || "";
    var value = config.value || "";
    var trend = config.trend || null;
    var icon = config.icon || "";
    var color = config.color || "var(--clr-primary)";
    var trendHtml = "";
    if (trend) {
      var up = trend.direction === "up";
      trendHtml = '<div class="stat-card__trend stat-card__trend--' + (up ? "up" : "down") + '">' + (up ? "\u2191" : "\u2193") + " " + trend.value + "</div>";
    }
    return '<div class="stat-card"><div class="stat-card__icon" style="color:' + color + '">' + icon + '</div><div class="stat-card__info"><div class="stat-card__value">' + value + '</div><div class="stat-card__label">' + label + "</div>" + trendHtml + "</div></div>";
  }
  return { create };
})();
