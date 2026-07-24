/**
 * Badge — Status badge component.
 * @module Badge
 */
const Badge = (function () {
  function render(text, type) {
    type = type || 'default';
    return '<span class="badge badge--' + type + '">' + text + '</span>';
  }
  return { render: render };
})();