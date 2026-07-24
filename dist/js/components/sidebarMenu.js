const SidebarMenu = /* @__PURE__ */ (function() {
  function renderItem(config) {
    var route = config.route || "";
    var icon = config.icon || "";
    var label = config.label || "";
    var active = config.active || false;
    return '<a href="#' + route + '" class="sidebar__item' + (active ? " active" : "") + '" data-route="' + route + '"><span class="sidebar__icon">' + icon + '</span><span class="sidebar__label">' + label + "</span></a>";
  }
  function renderDivider() {
    return '<div class="sidebar__divider"></div>';
  }
  function renderSection(label) {
    return '<div class="sidebar__section-label">' + label + "</div>";
  }
  return { renderItem, renderDivider, renderSection };
})();
