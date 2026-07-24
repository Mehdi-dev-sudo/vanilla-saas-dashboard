/**
 * FormField — Reusable form field with validation.
 * @module FormField
 */
const FormField = (function () {
  function render(config) {
    var type = config.type || 'text';
    var id = config.id || '';
    var label = config.label || '';
    var placeholder = config.placeholder || '';
    var value = config.value || '';
    var error = config.error || '';
    var required = config.required || false;
    var h = '<div class="form-group">';
    if (label) h += '<label class="form-label" for="' + id + '">' + label + (required ? ' <span class="form-required">*</span>' : '') + '</label>';
    if (type === 'textarea') {
      h += '<textarea class="form-textarea" id="' + id + '" name="' + id + '" placeholder="' + placeholder + '" rows="' + (config.rows || 4) + '">' + value + '</textarea>';
    } else if (type === 'select') {
      h += '<select class="form-select" id="' + id + '" name="' + id + '">';
      (config.options || []).forEach(function (opt) {
        h += '<option value="' + opt.value + '"' + (opt.value === value ? ' selected' : '') + '>' + opt.label + '</option>';
      });
      h += '</select>';
    } else {
      h += '<input type="' + type + '" class="form-input" id="' + id + '" name="' + id + '" placeholder="' + placeholder + '" value="' + value + '">';
    }
    if (error) h += '<span class="form-error" role="alert" style="display:' + (error ? 'block' : 'none') + '">' + error + '</span>';
    h += '</div>';
    return h;
  }
  return { render: render };
})();