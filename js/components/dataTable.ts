const DataTable = (function () {
  function create(containerId, config) {
    var container = document.getElementById(containerId);
    if (!container) return null;
    var columns = config.columns || [];
    var data = config.data || [];
    var onSort = config.onSort || null;
    var onSelect = config.onSelect || null;
    var selected = [];
    var sortKey = null;
    var sortDir = 'asc';
    function render() {
      var html = '<table class="table"><thead><tr>';
      if (onSelect) html += '<th class="table__cell table__cell--check"><input type="checkbox" id="selectAll" aria-label="Select all rows"></th>';
      columns.forEach(function (col) {
        var sorter = col.sortable ? ' style="cursor:pointer" data-sort="' + col.key + '"' : '';
        html += '<th class="table__cell table__cell--head"' + sorter + '>' + col.label;
        if (sortKey === col.key) html += ' <span class="sort-arrow">' + (sortDir === 'asc' ? '&#9650;' : '&#9660;') + '</span>';
        html += '</th>';
      });
      html += '</tr></thead><tbody>';
      if (!data.length) {
        html += '<tr><td class="table__cell" colspan="' + (columns.length + (onSelect ? 1 : 0)) + '"><div class="empty-state"><div class="empty-state__title">No data</div></div></td></tr>';
      } else {
        data.forEach(function (row, i) {
          html += '<tr class="table__row' + (selected.indexOf(row.id || i) !== -1 ? ' selected' : '') + '" data-row-id="' + (row.id || i) + '">';
          if (onSelect) html += '<td class="table__cell"><input type="checkbox" class="row-check" value="' + (row.id || i) + '" ' + (selected.indexOf(row.id || i) !== -1 ? 'checked' : '') + ' aria-label="Select row ' + (i + 1) + '"></td>';
          columns.forEach(function (col) {
            html += '<td class="table__cell">' + (col.render ? col.render(row[col.key], row) : (row[col.key] != null ? row[col.key] : '')) + '</td>';
          });
          html += '</tr>';
        });
      }
      html += '</tbody></table>';
      container.innerHTML = html;
      bindEvents();
    }
    function bindEvents() {
      if (onSort) {
        container.querySelectorAll('[data-sort]').forEach(function (th) {
          th.addEventListener('click', function () {
            var key = this.dataset.sort;
            sortDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
            sortKey = key;
            if (onSort) onSort(key, sortDir);
          });
        });
      }
      if (onSelect) {
        var selectAll = container.querySelector('#selectAll');
        if (selectAll) selectAll.addEventListener('change', function () {
          selected = this.checked ? data.map(function (r, i) { return r.id || i; }) : [];
          render();
          if (onSelect) onSelect(selected);
        });
        container.querySelectorAll('.row-check').forEach(function (cb) {
          cb.addEventListener('change', function () {
            var val = parseInt(this.value);
            if (this.checked) { if (selected.indexOf(val) === -1) selected.push(val); }
            else { selected = selected.filter(function (s) { return s !== val; }); }
            render();
            if (onSelect) onSelect(selected);
          });
        });
      }
    }
    function update(newData) { data = newData; render(); }
    function getSelected() { return selected; }
    function getSort() { return sortKey ? { key: sortKey, dir: sortDir } : null; }
    render();
    return { update: update, getSelected: getSelected, getSort: getSort, render: render };
  }
  return { create: create };
})();
