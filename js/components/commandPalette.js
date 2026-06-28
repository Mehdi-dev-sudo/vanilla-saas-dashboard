const CommandPalette = (function () {
  const STORAGE_KEY = 'saas_command_history';
  let isOpen = false;
  let commands = [];
  let filteredCommands = [];
  let selectedIndex = 0;
  let searchHistory = [];

  const overlay = document.createElement('div');
  overlay.className = 'cmd-palette-overlay';
  overlay.innerHTML =
    '<div class="cmd-palette" role="dialog" aria-modal="true" aria-label="Command palette">' +
      '<div class="cmd-palette__input-wrapper">' +
        '<svg class="cmd-palette__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input type="text" class="cmd-palette__input" id="cmdInput" placeholder="Type a command..." autocomplete="off" spellcheck="false">' +
        '<span class="cmd-palette__hint">ESC to close</span>' +
      '</div>' +
      '<div class="cmd-palette__results" id="cmdResults"></div>' +
      '<div class="cmd-palette__footer">' +
        '<span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 12 15 20 7"/></svg> Navigate</span>' +
        '<span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Select</span>' +
        '<span>ESC Cancel</span>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  const input = overlay.querySelector('#cmdInput');
  const resultsEl = overlay.querySelector('#cmdResults');

  function init() {
    loadHistory();
    buildCommands();

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    });

    input.addEventListener('input', filterCommands);
    input.addEventListener('keydown', handleInputKeydown);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
  }

  function buildCommands() {
    commands = [
      // Navigation
      { id: 'nav-dashboard', category: 'Navigation', label: 'Go to Dashboard', icon: 'grid', action: function () { Router.navigate('dashboard'); close(); } },
      { id: 'nav-analytics', category: 'Navigation', label: 'Go to Analytics', icon: 'bar-chart', action: function () { Router.navigate('analytics'); close(); } },
      { id: 'nav-users', category: 'Navigation', label: 'Go to Users', icon: 'users', action: function () { Router.navigate('users'); close(); } },
      { id: 'nav-transactions', category: 'Navigation', label: 'Go to Transactions', icon: 'credit-card', action: function () { Router.navigate('transactions'); close(); } },
      { id: 'nav-settings', category: 'Navigation', label: 'Go to Settings', icon: 'settings', action: function () { Router.navigate('settings'); close(); } },
      { id: 'nav-support', category: 'Navigation', label: 'Go to Support', icon: 'help-circle', action: function () { Router.navigate('support'); close(); } },

      // Actions
      { id: 'act-adduser', category: 'Actions', label: 'Add New User', icon: 'user-plus', action: function () { close(); Router.navigate('users'); setTimeout(function () { document.getElementById('addUserBtn') && document.getElementById('addUserBtn').click(); }, 150); } },
      { id: 'act-export', category: 'Actions', label: 'Export Transactions CSV', icon: 'download', action: function () { close(); var txs = AppStore.getState('transactions'); AppStore.exportTransactionsCSV(txs); ToastSystem.success('CSV exported'); } },
      { id: 'act-theme', category: 'Actions', label: 'Toggle Theme', icon: 'sun', action: function () { close(); ThemeManager.toggle(); ToastSystem.info('Theme: ' + ThemeManager.getCurrent()); } },
      { id: 'act-undo', category: 'Actions', label: 'Undo (Ctrl+Z)', icon: 'rotate-ccw', action: function () { close(); setTimeout(function () { HistoryManager.undo(); }, 100); } },
      { id: 'act-redo', category: 'Actions', label: 'Redo (Ctrl+Shift+Z)', icon: 'rotate-cw', action: function () { close(); setTimeout(function () { HistoryManager.redo(); }, 100); } },
      { id: 'act-settings', category: 'Actions', label: 'Open Quick Settings', icon: 'sliders', action: function () { close(); Router.navigate('settings'); } },
      { id: 'act-logout', category: 'Actions', label: 'Logout', icon: 'log-out', action: function () { close(); setTimeout(function () { AuthManager.logout(); }, 100); } },

      // Recent (from history)
    ];

    searchHistory.forEach(function (term) {
      if (!commands.find(function (c) { return c.id === 'hist-' + term.replace(/\s+/g, '-').toLowerCase(); })) {
        commands.push({
          id: 'hist-' + term.replace(/\s+/g, '-').toLowerCase(),
          category: 'Recent',
          label: term,
          icon: 'clock',
          action: function () { close(); }
        });
      }
    });
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function open() {
    isOpen = true;
    overlay.classList.add('open');
    buildCommands();
    input.value = '';
    filteredCommands = commands;
    selectedIndex = 0;
    renderResults();
    input.focus();
  }

  function close() {
    isOpen = false;
    overlay.classList.remove('open');
    if (document.activeElement === input) input.blur();
  }

  function filterCommands() {
    const query = input.value.toLowerCase().trim();
    if (query) {
      filteredCommands = commands.filter(function (c) {
        return c.label.toLowerCase().includes(query) || c.category.toLowerCase().includes(query);
      });
      filteredCommands.sort(function (a, b) {
        const aIdx = a.label.toLowerCase().indexOf(query);
        const bIdx = b.label.toLowerCase().indexOf(query);
        if (aIdx === -1 && bIdx === -1) return 0;
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
      });
    } else {
      filteredCommands = commands;
    }
    selectedIndex = 0;
    renderResults();
  }

  function renderResults() {
    if (filteredCommands.length === 0) {
      resultsEl.innerHTML = '<div class="cmd-palette__empty">No commands found</div>';
      return;
    }

    let currentCategory = '';
    let html = '';

    filteredCommands.forEach(function (cmd, idx) {
      if (cmd.category !== currentCategory) {
        currentCategory = cmd.category;
        html += '<div class="cmd-palette__category">' + currentCategory + '</div>';
      }
      html +=
        '<div class="cmd-palette__item' + (idx === selectedIndex ? ' selected' : '') + '" data-index="' + idx + '">' +
          '<span class="cmd-palette__item-icon">' + getIconSvg(cmd.icon) + '</span>' +
          '<span class="cmd-palette__item-label">' + cmd.label + '</span>' +
        '</div>';
    });

    resultsEl.innerHTML = html;

    resultsEl.querySelectorAll('.cmd-palette__item').forEach(function (item) {
      item.addEventListener('click', function () {
        const idx = parseInt(this.dataset.index);
        if (filteredCommands[idx]) {
          addToHistory(filteredCommands[idx].label);
          filteredCommands[idx].action();
        }
      });
      item.addEventListener('mouseenter', function () {
        selectedIndex = parseInt(this.dataset.index);
        updateSelected();
      });
    });

    updateSelected();
  }

  function updateSelected() {
    resultsEl.querySelectorAll('.cmd-palette__item').forEach(function (item, idx) {
      item.classList.toggle('selected', idx === selectedIndex);
    });
    const selected = resultsEl.querySelector('.cmd-palette__item.selected');
    if (selected) selected.scrollIntoView({ block: 'nearest' });
  }

  function handleInputKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectedIndex < filteredCommands.length - 1) selectedIndex++;
      updateSelected();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selectedIndex > 0) selectedIndex--;
      updateSelected();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        addToHistory(filteredCommands[selectedIndex].label);
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        const firstLabel = filteredCommands[0].label;
        input.value = firstLabel;
        filterCommands();
      }
    }
  }

  function addToHistory(label) {
    searchHistory = searchHistory.filter(function (h) { return h !== label; });
    searchHistory.unshift(label);
    if (searchHistory.length > 10) searchHistory.pop();
    saveHistory();
  }

  function loadHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      searchHistory = data ? JSON.parse(data) : [];
    } catch (e) { searchHistory = []; }
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
    } catch (e) { /* ignore */ }
  }

  function getIconSvg(name) {
    const icons = {
      'grid': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
      'bar-chart': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
      'users': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
      'credit-card': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      'settings': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06"/></svg>',
      'help-circle': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      'user-plus': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
      'download': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
      'sun': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>',
      'rotate-ccw': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
      'rotate-cw': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
      'sliders': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
      'log-out': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
      'clock': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      'info': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    return icons[name] || icons.info;
  }

  return { init, open, close, isOpen: function () { return isOpen; } };
})();
