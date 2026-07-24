/**
 * FilterDropdown — Dropdown filter component.
 * @module FilterDropdown
 */
const FilterDropdown = (function () {
  function create(containerId, opts) {
    var c = document.getElementById(containerId);
    if (!c) return null;
    var options = opts.options || [];
    var selected = opts.selected || '';
    var placeholder = opts.placeholder || 'Filter...';
    var onChange = opts.onChange || null;
    function render() {
      var h = '<div class="filter-dropdown"><select class="form-select" id="fdSelect">';
      h += '<option value="">' + placeholder + '</option>';
      options.forEach(function (opt) {
        h += '<option value="' + opt.value + '"' + (opt.value === selected ? ' selected' : '') + '>' + opt.label + '</option>';
      });
      h += '</select></div>';
      c.innerHTML = h;
      var sel = c.querySelector('#fdSelect');
      if (sel) sel.addEventListener('change', function () {
        selected = this.value;
        if (onChange) onChange(selected);
      });
    }
    function getValue() { return selected; }
    function setValue(v) { selected = v; render(); }
    render();
    return { getValue: getValue, setValue: setValue };
  }
  return { create: create };
})();