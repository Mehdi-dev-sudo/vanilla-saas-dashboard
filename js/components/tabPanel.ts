/**
 * TabPanel — Accessible tabbed panel component.
 * @module TabPanel
 */
const TabPanel = (function () {
  function create(containerId, tabs, onTabChange) {
    var c = document.getElementById(containerId);
    if (!c) return null;
    var active = 0;
    function render() {
      var h = '<div class="tab-panel"><div class="tab-panel__tabs" role="tablist">';
      tabs.forEach(function (tab, i) {
        h += '<button class="tab-panel__tab' + (i === active ? ' active' : '') + '" role="tab" aria-selected="' + (i === active ? 'true' : 'false') + '" data-tab-index="' + i + '">' + tab.label + '</button>';
      });
      h += '</div><div class="tab-panel__content" role="tabpanel">' + tabs[active].content + '</div></div>';
      c.innerHTML = h;
      c.querySelectorAll('.tab-panel__tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          active = parseInt(this.dataset.tabIndex);
          render();
          if (onTabChange) onTabChange(active);
        });
      });
    }
    render();
    function setActive(i) { active = i; render(); }
    return { setActive: setActive };
  }
  return { create: create };
})();