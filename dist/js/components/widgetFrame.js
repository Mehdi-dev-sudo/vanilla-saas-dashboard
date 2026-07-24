const WidgetFrame = /* @__PURE__ */ (function() {
  function create(config) {
    var id = config.id || "";
    var title = config.title || "";
    var content = config.content || "";
    return '<div class="card widget" data-widget-id="' + id + '"><div class="card__header widget__header"><div><h3 class="card__title">' + title + '</h3></div><div class="card__actions"><button class="card__btn card__btn--drag" data-widget-drag="' + id + '" title="Drag to reorder" aria-label="Drag ' + title + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg></button><button class="card__btn card__btn--hide" data-widget-hide="' + id + '" title="Hide widget" aria-label="Hide ' + title + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div></div><div class="card__body widget__body">' + content + "</div></div>";
  }
  return { create };
})();
