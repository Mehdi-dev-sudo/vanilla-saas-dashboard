const ErrorPage = (function() {
  function render(state, type) {
    type = type || "404";
    var pages = {
      "404": {
        code: "404",
        title: __("error.404.title"),
        message: __("error.404.message"),
        icon: '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>'
      },
      "500": {
        code: "500",
        title: __("error.500.title"),
        message: __("error.500.message"),
        icon: '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--clr-danger)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
      },
      "network": {
        code: __("error.network.code"),
        title: __("error.network.title"),
        message: __("error.network.message"),
        icon: '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--clr-warning)" stroke-width="1.5"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>'
      }
    };
    var page = pages[type] || pages["404"];
    return `
      <div class="error-page">
        <div class="error-page__content">
          ${page.icon}
          <h1 class="error-page__code">${page.code}</h1>
          <h2 class="error-page__title">${page.title}</h2>
          <p class="error-page__message">${page.message}</p>
          <div class="error-page__actions">
            <button class="btn btn--primary" onclick="Router.navigate('dashboard')">${__("error.goToDashboard")}</button>
            <button class="btn btn--secondary" onclick="window.history.back()">${__("error.goBack")}</button>
          </div>
        </div>
      </div>
    `;
  }
  function init() {
    return function cleanup() {
    };
  }
  return typeof BaseComponent !== "undefined" ? BaseComponent.create({ render, init }) : { render, init };
})();
