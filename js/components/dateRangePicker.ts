/**
 * DateRangePicker — Simple date range picker.
 * @module DateRangePicker
 */
const DateRangePicker = (function () {
  function render(startId, endId, startVal, endVal) {
    return '<div class="date-range">' +
      '<input type="date" class="form-input" id="' + startId + '" value="' + (startVal || '') + '" aria-label="Start date">' +
      '<span style="padding:0 var(--space-xs)">to</span>' +
      '<input type="date" class="form-input" id="' + endId + '" value="' + (endVal || '') + '" aria-label="End date">' +
      '</div>';
  }
  return { render: render };
})();