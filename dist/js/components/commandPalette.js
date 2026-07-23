const CommandPalette = (function() {
  const STORAGE_KEY = "saas_command_history";
  let isOpen = false;
  let commands = [];
  let filteredCommands = [];
  let selectedIndex = 0;
  let searchHistory = [];
  const overlay = document.createElement("div");
  overlay.className = "cmd-palette-overlay";
  overlay.innerHTML = '<div class="cmd-palette" role="dialog" aria-modal="true" aria-label="Command palette"><div class="cmd-palette__input-wrapper"><svg class="cmd-palette__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" class="cmd-palette__input" id="cmdInput" placeholder="Type &gt; for actions, or search..." autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="cmdResults"><span class="cmd-palette__hint">ESC to close</span></div><div class="cmd-palette__results" id="cmdResults" role="listbox"></div><div class="cmd-palette__footer"><span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 12 15 20 7"/></svg> Navigate</span><span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Select</span><span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> > Actions</span><span>ESC Cancel</span></div></div>';
  document.body.appendChild(overlay);
  const input = overlay.querySelector("#cmdInput");
  const resultsEl = overlay.querySelector("#cmdResults");
  function init() {
    loadHistory();
    buildCommands();
    document.addEventListener("keydown", function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape" && isOpen) {
        close();
      }
    });
    input.addEventListener("input", filterCommands);
    input.addEventListener("keydown", handleInputKeydown);
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) close();
    });
  }
  function buildCommands() {
    commands = [
      // Navigation
      { id: "nav-dashboard", category: "Navigation", label: "Go to Dashboard", keywords: "gd home", icon: "grid", action: function() {
        close();
        Router.navigate("dashboard");
      } },
      { id: "nav-analytics", category: "Navigation", label: "Go to Analytics", keywords: "ga", icon: "bar-chart", action: function() {
        close();
        Router.navigate("analytics");
      } },
      { id: "nav-users", category: "Navigation", label: "Go to Users", keywords: "gu", icon: "users", action: function() {
        close();
        Router.navigate("users");
      } },
      { id: "nav-transactions", category: "Navigation", label: "Go to Transactions", keywords: "gt", icon: "credit-card", action: function() {
        close();
        Router.navigate("transactions");
      } },
      { id: "nav-settings", category: "Navigation", label: "Go to Settings", keywords: "gs", icon: "settings", action: function() {
        close();
        Router.navigate("settings");
      } },
      { id: "nav-support", category: "Navigation", label: "Go to Support", keywords: "gsh", icon: "help-circle", action: function() {
        close();
        Router.navigate("support");
      } },
      // Actions
      { id: "act-adduser", category: "Actions", label: "Create User", keywords: "new user add", icon: "user-plus", action: function() {
        close();
        Router.navigate("users");
        setTimeout(function() {
          var btn = document.getElementById("addUserBtn");
          if (btn) btn.click();
        }, 150);
      } },
      { id: "act-deleteuser", category: "Actions", label: "Delete User", keywords: "remove", icon: "trash-2", action: function() {
        close();
        Router.navigate("users");
        if (typeof ToastSystem !== "undefined") ToastSystem.info("Select a user to delete");
      } },
      { id: "act-export", category: "Actions", label: "Export CSV", keywords: "download transactions", icon: "download", action: function() {
        close();
        var txs = AppStore.getState("transactions");
        if (txs.length) {
          AppStore.exportTransactionsCSV(txs);
          if (typeof ToastSystem !== "undefined") ToastSystem.success("CSV exported");
        } else {
          if (typeof ToastSystem !== "undefined") ToastSystem.error("No transactions to export");
        }
      } },
      { id: "act-theme", category: "Actions", label: "Toggle Theme", keywords: "dark light mode", icon: "sun", action: function() {
        close();
        ThemeManager.toggle();
        if (typeof ToastSystem !== "undefined") ToastSystem.info("Theme: " + ThemeManager.getCurrent());
      } },
      { id: "act-undo", category: "Actions", label: "Undo", keywords: "ctrl z", icon: "rotate-ccw", action: function() {
        close();
        setTimeout(function() {
          HistoryManager.undo();
        }, 100);
      } },
      { id: "act-redo", category: "Actions", label: "Redo", keywords: "ctrl shift z", icon: "rotate-cw", action: function() {
        close();
        setTimeout(function() {
          HistoryManager.redo();
        }, 100);
      } },
      { id: "act-keys", category: "Actions", label: "Keyboard Shortcuts", keywords: "help keys shortcuts", icon: "keyboard", action: function() {
        close();
        setTimeout(function() {
          if (window.showKeyboardHelp) window.showKeyboardHelp();
        }, 100);
      } },
      { id: "act-reload", category: "Actions", label: "Reload Data", keywords: "refresh reset api", icon: "refresh-cw", action: function() {
        close();
        ApiClient.clearCache();
        ToastSystem.success("Cache cleared. Reloading...");
        setTimeout(function() {
          window.location.reload();
        }, 500);
      } },
      { id: "act-logout", category: "Actions", label: "Logout", keywords: "sign out exit", icon: "log-out", action: function() {
        close();
        setTimeout(function() {
          AuthManager.logout();
        }, 100);
      } },
      // Pages
      { id: "pg-dashboard", category: "Pages", label: "Dashboard", keywords: "home", icon: "grid", action: function() {
        close();
        Router.navigate("dashboard");
      } },
      { id: "pg-analytics", category: "Pages", label: "Analytics", keywords: "stats", icon: "bar-chart", action: function() {
        close();
        Router.navigate("analytics");
      } },
      { id: "pg-users", category: "Pages", label: "Users", keywords: "people team", icon: "users", action: function() {
        close();
        Router.navigate("users");
      } },
      { id: "pg-transactions", category: "Pages", label: "Transactions", keywords: "payments billing", icon: "credit-card", action: function() {
        close();
        Router.navigate("transactions");
      } },
      { id: "pg-settings", category: "Pages", label: "Settings", keywords: "preferences config", icon: "settings", action: function() {
        close();
        Router.navigate("settings");
      } }
      // Recent (from history)
    ];
    searchHistory.forEach(function(term) {
      if (!commands.find(function(c) {
        return c.id === "hist-" + term.replace(/\s+/g, "-").toLowerCase();
      })) {
        commands.push({
          id: "hist-" + term.replace(/\s+/g, "-").toLowerCase(),
          category: "Recent",
          label: term,
          icon: "clock",
          action: function() {
            close();
          }
        });
      }
    });
  }
  function toggle() {
    isOpen ? close() : open();
  }
  function open() {
    isOpen = true;
    overlay.classList.add("open");
    buildCommands();
    input.value = "";
    filteredCommands = commands;
    selectedIndex = 0;
    renderResults();
    input.focus();
  }
  function close() {
    isOpen = false;
    overlay.classList.remove("open");
    if (document.activeElement === input) input.blur();
  }
  function filterCommands() {
    var query = input.value.toLowerCase().trim();
    if (query === ">" || query === "> ") {
      filteredCommands = commands.filter(function(c) {
        return c.category === "Actions";
      });
      selectedIndex = 0;
      renderResults();
      return;
    }
    if (query.startsWith(">")) {
      var actionQuery = query.slice(1).trim();
      filteredCommands = commands.filter(function(c) {
        return c.category === "Actions" && (c.label.toLowerCase().includes(actionQuery) || c.keywords && c.keywords.includes(actionQuery));
      });
      if (actionQuery) {
        filteredCommands.sort(function(a, b) {
          var aIdx = a.label.toLowerCase().indexOf(actionQuery);
          var bIdx = b.label.toLowerCase().indexOf(actionQuery);
          if (aIdx === -1 && bIdx === -1) return 0;
          if (aIdx === -1) return 1;
          if (bIdx === -1) return -1;
          return aIdx - bIdx;
        });
      }
      selectedIndex = 0;
      renderResults();
      return;
    }
    if (query) {
      filteredCommands = commands.filter(function(c) {
        var matchLabel = c.label.toLowerCase().includes(query);
        var matchCategory = c.category.toLowerCase().includes(query);
        var matchKeywords = c.keywords && c.keywords.includes(query);
        return matchLabel || matchCategory || matchKeywords;
      });
      filteredCommands.sort(function(a, b) {
        var aIdx = a.label.toLowerCase().indexOf(query);
        var bIdx = b.label.toLowerCase().indexOf(query);
        if (aIdx === -1 && bIdx === -1) return 0;
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
      });
    } else {
      filteredCommands = commands.slice(0, 20);
    }
    selectedIndex = 0;
    renderResults();
  }
  function renderResults() {
    if (filteredCommands.length === 0) {
      resultsEl.innerHTML = '<div class="cmd-palette__empty">No commands found</div>';
      return;
    }
    let currentCategory = "";
    let html = "";
    filteredCommands.forEach(function(cmd, idx) {
      if (cmd.category !== currentCategory) {
        currentCategory = cmd.category;
        html += '<div class="cmd-palette__category">' + currentCategory + "</div>";
      }
      html += '<div class="cmd-palette__item' + (idx === selectedIndex ? " selected" : "") + '" data-index="' + idx + '" role="option" id="cmd-opt-' + idx + '"' + (idx === selectedIndex ? ' aria-selected="true"' : "") + '><span class="cmd-palette__item-icon">' + getIconSvg(cmd.icon) + '</span><span class="cmd-palette__item-label">' + cmd.label + "</span></div>";
    });
    resultsEl.innerHTML = html;
    input.setAttribute("aria-activedescendant", "cmd-opt-" + selectedIndex);
    resultsEl.querySelectorAll(".cmd-palette__item").forEach(function(item) {
      item.addEventListener("click", function() {
        const idx = parseInt(this.dataset.index);
        if (filteredCommands[idx]) {
          addToHistory(filteredCommands[idx].label);
          filteredCommands[idx].action();
        }
      });
      item.addEventListener("mouseenter", function() {
        selectedIndex = parseInt(this.dataset.index);
        updateSelected();
      });
    });
    updateSelected();
  }
  function updateSelected() {
    resultsEl.querySelectorAll(".cmd-palette__item").forEach(function(item, idx) {
      item.classList.toggle("selected", idx === selectedIndex);
      if (idx === selectedIndex) item.setAttribute("aria-selected", "true");
      else item.removeAttribute("aria-selected");
    });
    input.setAttribute("aria-activedescendant", "cmd-opt-" + selectedIndex);
    var selected = resultsEl.querySelector(".cmd-palette__item.selected");
    if (selected) selected.scrollIntoView({ block: "nearest" });
  }
  function handleInputKeydown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (selectedIndex < filteredCommands.length - 1) selectedIndex++;
      updateSelected();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (selectedIndex > 0) selectedIndex--;
      updateSelected();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        addToHistory(filteredCommands[selectedIndex].label);
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        const firstLabel = filteredCommands[0].label;
        input.value = firstLabel;
        filterCommands();
      }
    }
  }
  function addToHistory(label) {
    searchHistory = searchHistory.filter(function(h) {
      return h !== label;
    });
    searchHistory.unshift(label);
    if (searchHistory.length > 10) searchHistory.pop();
    saveHistory();
  }
  function loadHistory() {
    var data = SafeStorage.getItem(STORAGE_KEY);
    try {
      searchHistory = data ? JSON.parse(data) : [];
    } catch (e) {
      searchHistory = [];
    }
  }
  function saveHistory() {
    SafeStorage.setObject(STORAGE_KEY, searchHistory);
  }
  function getIconSvg(name) {
    const icons = {
      "grid": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
      "bar-chart": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
      "users": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
      "credit-card": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      "settings": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06"/></svg>',
      "help-circle": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      "trash-2": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
      "keyboard": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h12"/></svg>',
      "refresh-cw": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
      "user-plus": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
      "download": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
      "sun": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>',
      "rotate-ccw": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
      "rotate-cw": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
      "sliders": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
      "log-out": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
      "clock": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      "info": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    return icons[name] || icons.info;
  }
  return { init, open, close, isOpen: function() {
    return isOpen;
  } };
})();
