const VirtualScroll = (function () {

  function createTable(container, items, rowHeight, renderRow, buffer) {
    buffer = buffer || 5;
    rowHeight = rowHeight || 48;
    var visibleRows = Math.ceil((container.clientHeight || 400) / rowHeight) + buffer * 2;
    var totalHeight = items.length * rowHeight;
    var scrollTop = 0;

    var wrapper = document.createElement('div');
    wrapper.className = 'virtual-scroll';
    wrapper.style.height = '100%';
    wrapper.style.overflow = 'auto';
    wrapper.style.position = 'relative';

    var spacer = document.createElement('div');
    spacer.style.height = totalHeight + 'px';
    spacer.style.pointerEvents = 'none';

    var viewport = document.createElement('div');
    viewport.style.position = 'relative';
    viewport.style.width = '100%';

    wrapper.appendChild(spacer);
    wrapper.appendChild(viewport);
    container.innerHTML = '';
    container.appendChild(wrapper);

    function render() {
      scrollTop = wrapper.scrollTop;
      var startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
      var endIdx = Math.min(items.length, startIdx + visibleRows);

      viewport.style.top = (startIdx * rowHeight) + 'px';
      viewport.innerHTML = '';

      for (var i = startIdx; i < endIdx; i++) {
        var row = renderRow(items[i], i);
        row.style.position = 'absolute';
        row.style.top = ((i - startIdx) * rowHeight) + 'px';
        row.style.height = rowHeight + 'px';
        row.style.left = '0';
        row.style.right = '0';
        viewport.appendChild(row);
      }
    }

    wrapper.addEventListener('scroll', function () {
      requestAnimationFrame(render);
    }, { passive: true });

    render();

    return {
      refresh: function (newItems) {
        items = newItems;
        totalHeight = items.length * rowHeight;
        spacer.style.height = totalHeight + 'px';
        render();
      },
      destroy: function () {
        container.innerHTML = '';
      }
    };
  }

  return { createTable };
})();
