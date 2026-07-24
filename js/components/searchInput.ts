/**
 * SearchInput — Reusable search input with debounce.
 * @module SearchInput
 */
const SearchInput = (function () {
  function create(containerId, opts) {
    var c = document.getElementById(containerId);
    if (!c) return null;
    var placeholder = opts.placeholder || 'Search...';
    var onSearch = opts.onSearch || null;
    var value = '';
    var timer = null;
    function render() {
      c.innerHTML = '<div class="search-input">' +
        '<svg class="search-input__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input type="text" class="search-input__field" id="siField" placeholder="' + placeholder + '" value="' + value + '">' +
        '</div>';
      var input = c.querySelector('#siField');
      if (input) {
        input.addEventListener('input', function () {
          value = this.value;
          clearTimeout(timer);
          timer = setTimeout(function () { if (onSearch) onSearch(value); }, 300);
        });
      }
    }
    function getValue() { return value; }
    function setValue(v) { value = v; render(); }
    render();
    return { getValue: getValue, setValue: setValue };
  }
  return { create: create };
})();