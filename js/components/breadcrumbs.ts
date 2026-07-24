/**
 * Breadcrumbs — Navigation breadcrumb component.
 * @module Breadcrumbs
 */
const Breadcrumbs = (function () {
  function render(items) {
    var h = '<nav class="breadcrumbs" aria-label="Breadcrumb">';
    items.forEach(function (item, i) {
      if (i > 0) h += '<span class="breadcrumbs__sep">/</span>';
      if (i === items.length - 1) {
        h += '<span class="breadcrumbs__current">' + item.label + '</span>';
      } else {
        h += '<a href="' + item.href + '" class="breadcrumbs__link">' + item.label + '</a>';
      }
    });
    h += '</nav>';
    return h;
  }
  return { render: render };
})();