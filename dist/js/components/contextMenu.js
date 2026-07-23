const ContextMenuManager = (function() {
  let menu = null;
  let targetRow = null;
  let currentHandler = null;
  function init() {
    document.addEventListener("contextmenu", function(e) {
      const row = e.target.closest("tr[data-context]");
      if (row) {
        e.preventDefault();
        show(e.clientX, e.clientY, row);
      }
    });
    document.addEventListener("click", function(e) {
      if (menu && !menu.contains(e.target)) {
        hide();
      }
    });
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && menu) hide();
    });
  }
  function show(x, y, row) {
    hide();
    targetRow = row;
    const type = row.dataset.context;
    const id = row.dataset.id;
    let items = [];
    if (type === "user") {
      items = [
        { label: "Edit User", icon: "edit", action: function() {
          if (typeof UsersPage !== "undefined") {
            var btns = row.querySelectorAll(".edit-user-btn");
            if (btns.length) btns[0].click();
          }
        } },
        { label: "Copy Email", icon: "copy", action: function() {
          var email = row.dataset.email;
          if (email) {
            navigator.clipboard.writeText(email).then(function() {
              ToastSystem.success("Email copied");
            });
          }
        } },
        { label: "Duplicate", icon: "copy-plus", action: function() {
          if (id && typeof AppStore !== "undefined") {
            var user = AppStore.getUser(id);
            if (user) {
              AppStore.addUser({ name: user.name + " (Copy)", email: "copy-" + user.email, role: user.role, plan: user.plan, status: "active", joined: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), revenue: 0 });
              HistoryManager.pushSnapshot();
              ToastSystem.success("User duplicated");
              if (typeof UsersPage !== "undefined" && UsersPage.refresh) UsersPage.refresh();
            }
          }
        } },
        { type: "separator" },
        { label: "Delete User", icon: "trash-2", danger: true, action: function() {
          if (id) {
            var delBtns = row.querySelectorAll(".delete-user-btn");
            if (delBtns.length) delBtns[0].click();
          }
        } }
      ];
    } else if (type === "transaction") {
      items = [
        { label: "View Details", icon: "eye", action: function() {
          ToastSystem.info("Transaction: " + (row.dataset.invoice || ""));
        } },
        { label: "Copy Invoice", icon: "copy", action: function() {
          var inv = row.dataset.invoice;
          if (inv) {
            navigator.clipboard.writeText(inv).then(function() {
              ToastSystem.success("Invoice copied");
            });
          }
        } },
        { type: "separator" },
        { label: "Export Row", icon: "download", action: function() {
          ToastSystem.success("Row exported");
        } }
      ];
    } else {
      return;
    }
    menu = document.createElement("div");
    menu.className = "context-menu";
    menu.style.left = Math.min(x, window.innerWidth - 200) + "px";
    menu.style.top = Math.min(y, window.innerHeight - items.length * 40 - 20) + "px";
    items.forEach(function(item) {
      if (item.type === "separator") {
        var sep = document.createElement("div");
        sep.className = "context-menu__separator";
        menu.appendChild(sep);
        return;
      }
      var el = document.createElement("button");
      el.className = "context-menu__item" + (item.danger ? " context-menu__item--danger" : "");
      el.innerHTML = getIcon(item.icon) + "<span>" + item.label + "</span>";
      el.addEventListener("click", function() {
        item.action();
        hide();
      });
      menu.appendChild(el);
    });
    document.body.appendChild(menu);
    requestAnimationFrame(function() {
      menu.classList.add("open");
      var firstItem = menu.querySelector(".context-menu__item");
      if (firstItem) firstItem.focus();
    });
  }
  function hide() {
    if (menu) {
      menu.classList.remove("open");
      setTimeout(function() {
        if (menu && menu.parentNode) menu.parentNode.removeChild(menu);
        menu = null;
        targetRow = null;
      }, 150);
    }
  }
  document.addEventListener("keydown", function(e) {
    if (!menu) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      var items = menu.querySelectorAll(".context-menu__item");
      var active = menu.querySelector(".context-menu__item:focus");
      var idx = Array.from(items).indexOf(active);
      var next = (idx + 1) % items.length;
      items[next].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      var items = menu.querySelectorAll(".context-menu__item");
      var active = menu.querySelector(".context-menu__item:focus");
      var idx = Array.from(items).indexOf(active);
      var prev = (idx - 1 + items.length) % items.length;
      items[prev].focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      var active = menu.querySelector(".context-menu__item:focus");
      if (active) active.click();
    }
  });
  function getIcon(name) {
    const icons = {
      "edit": '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
      "copy": '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
      "copy-plus": '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/><line x1="15" y1="6" x2="15" y2="12"/><line x1="12" y1="9" x2="18" y2="9"/></svg>',
      "trash-2": '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
      "eye": '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
      "download": '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
    };
    return icons[name] || "";
  }
  return { init, hide };
})();
