const SettingsPage = (function() {
  function render() {
    var settings = AppStore.getState("settings");
    return `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Settings</h1>
          <p class="page-header__subtitle">Manage your application preferences</p>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section__header">
          <h3 class="settings-section__title">Appearance</h3>
          <p class="settings-section__desc">Customize the look and feel</p>
        </div>
        <div class="settings-row">
          <div class="settings-row__info">
            <div class="settings-row__label">Theme</div>
            <div class="settings-row__desc">Switch between light and dark mode</div>
          </div>
          <div class="flex items-center gap-md">
            <span style="font-size:var(--font-sm);color:var(--text-secondary)" id="themeStatus">${ThemeManager.getCurrent() === "dark" ? "Dark" : "Light"}</span>
            <button class="btn btn--sm btn--secondary" id="toggleThemeBtn">Toggle</button>
          </div>
        </div>
        ${renderSelect("language", "Language", "Interface language", settings.language || "en", { en: "English", fa: "Persian (RTL)", de: "Deutsch", fr: "Francais", es: "Espanol" })}
        ${renderSelect("density", "Density", "Controls the spacing in the interface", settings.density || "comfortable", { comfortable: "Comfortable", compact: "Compact", cozy: "Cozy" })}
        ${renderSelect("accentColor", "Accent Color", "Primary brand color", settings.accentColor || "indigo", { indigo: "Indigo", blue: "Blue", green: "Green", purple: "Purple", orange: "Orange", red: "Red" })}
        ${renderToggle("animations", "Animations", "Enable UI animations and transitions", settings.animations !== false)}
        ${renderToggle("reducedMotion", "Reduced Motion", "Minimize animations for accessibility", settings.reducedMotion)}
        ${renderSelect("dateFormat", "Date Format", "Display format for dates", settings.dateFormat || "MMM D, YYYY", { "MMM D, YYYY": "Mar 28, 2026", "D MMM YYYY": "28 Mar 2026", "MM/DD/YYYY": "03/28/2026", "DD/MM/YYYY": "28/03/2026", "YYYY-MM-DD": "2026-03-28" })}
        ${renderSelect("currency", "Currency", "Currency symbol for revenue", settings.currency || "USD", { USD: "$ (USD)", EUR: "\u20AC (EUR)", GBP: "\xA3 (GBP)", JPY: "\xA5 (JPY)" })}
      </div>

      <div class="settings-section" style="margin-top:var(--space-xl)">
        <div class="settings-section__header">
          <h3 class="settings-section__title">Notifications</h3>
          <p class="settings-section__desc">Configure how you receive notifications</p>
        </div>
        ${renderToggle("emailNotifications", "Email Notifications", "Receive email alerts for important updates", settings.emailNotifications)}
        ${renderToggle("pushNotifications", "Push Notifications", "Receive push notifications in your browser", settings.pushNotifications)}
        ${renderToggle("weeklyDigest", "Weekly Digest", "Receive a weekly summary of your account activity", settings.weeklyDigest)}
      </div>

      <div class="settings-section" style="margin-top:var(--space-xl)">
        <div class="settings-section__header">
          <h3 class="settings-section__title">Dashboard</h3>
          <p class="settings-section__desc">Configure your dashboard layout</p>
        </div>
        ${renderToggle("compactView", "Compact View", "Use a more compact layout with less spacing", settings.compactView)}
        ${renderSelect("defaultPage", "Default Page", "Landing page after login", settings.defaultPage || "analytics", { analytics: "Analytics", users: "Users", transactions: "Transactions" })}
        ${renderToggle("sidebarCollapsed", "Sidebar Collapsed", "Start with sidebar collapsed by default", settings.sidebarCollapsed)}
        ${renderToggle("autoSave", "Auto-Save", "Automatically save changes as you work", settings.autoSave)}
        ${renderToggle("showActivityLog", "Activity Log", "Show recent activity on dashboard", settings.showActivityLog !== false)}
        ${renderToggle("showQuickActions", "Quick Actions", "Show quick action buttons on dashboard", settings.showQuickActions !== false)}
      </div>

      <div class="settings-section" style="margin-top:var(--space-xl)">
        <div class="settings-section__header">
          <h3 class="settings-section__title">Account</h3>
          <p class="settings-section__desc">Your account information</p>
        </div>
        <div class="settings-row">
          <div class="settings-row__info">
            <div class="settings-row__label">Name</div>
            <div class="settings-row__desc" id="settingsUserName">${AuthManager.isLoggedIn && AuthManager.getUser() ? AuthManager.getUser().name : "\u2014"}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row__info">
            <div class="settings-row__label">Email</div>
            <div class="settings-row__desc" id="settingsUserEmail">${AuthManager.isLoggedIn && AuthManager.getUser() ? AuthManager.getUser().email : "\u2014"}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row__info">
            <div class="settings-row__label">Plan</div>
            <div class="settings-row__desc">Enterprise Plan</div>
          </div>
          <button class="btn btn--sm btn--primary" aria-label="Upgrade your plan">Upgrade</button>
        </div>
      </div>

      <div class="settings-actions" style="margin-top:var(--space-xl);display:flex;gap:var(--space-sm);flex-wrap:wrap">
        <button class="btn btn--secondary" id="exportSettingsBtn">Export Settings</button>
        <button class="btn btn--secondary" id="importSettingsBtn">Import Settings</button>
        <input type="file" id="importSettingsFile" accept=".json" style="display:none">
        <button class="btn btn--secondary" id="resetSettingsBtn">Reset to Defaults</button>
        <button class="btn btn--primary" id="saveSettingsBtn">Save Changes</button>
      </div>
    `;
  }
  function renderToggle(key, label, desc, value) {
    return `
      <div class="settings-row">
        <div class="settings-row__info">
          <div class="settings-row__label">${label}</div>
          <div class="settings-row__desc">${desc}</div>
        </div>
        <div class="toggle${value ? " active" : ""}" data-setting="${key}" role="switch" aria-checked="${value}" tabindex="0">
          <div class="toggle__track"></div>
        </div>
      </div>
    `;
  }
  function renderSelect(key, label, desc, value, options) {
    var opts = Object.keys(options).map(function(k) {
      return '<option value="' + k + '"' + (k === value ? " selected" : "") + ">" + options[k] + "</option>";
    }).join("");
    return `
      <div class="settings-row">
        <div class="settings-row__info">
          <div class="settings-row__label">${label}</div>
          <div class="settings-row__desc">${desc}</div>
        </div>
        <select class="form-select" data-setting-select="${key}" style="width:160px">${opts}</select>
      </div>
    `;
  }
  function init() {
    document.querySelectorAll(".toggle[data-setting]").forEach(function(toggle) {
      var key = toggle.dataset.setting;
      function toggleActive() {
        toggle.classList.toggle("active");
        var isActive = toggle.classList.contains("active");
        toggle.setAttribute("aria-checked", isActive);
        AppStore.updateState("settings", (function(o) {
          o[key] = isActive;
          return o;
        })({}));
        if (key === "animations") document.documentElement.classList.toggle("no-animations", !isActive);
        if (key === "reducedMotion") document.documentElement.classList.toggle("reduced-motion", isActive);
        if (key === "compactView") document.documentElement.classList.toggle("compact-view", isActive);
        if (key === "sidebarCollapsed") {
          var sb = document.querySelector(".sidebar");
          if (sb) sb.classList.toggle("collapsed", isActive);
        }
      }
      toggle.addEventListener("click", toggleActive);
      toggle.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleActive();
        }
      });
    });
    document.querySelectorAll("[data-setting-select]").forEach(function(select) {
      var key = select.dataset.settingSelect;
      select.addEventListener("change", function() {
        AppStore.updateState("settings", (function(o, val) {
          o[key] = val;
          return o;
        })({}, select.value));
        if (key === "accentColor") applyAccentColor(this.value);
        if (key === "density") applyDensity(this.value);
        if (key === "dateFormat" || key === "currency") {
          ActivityLog.add("edit", key.charAt(0).toUpperCase() + key.slice(1) + " changed", "edit");
        }
        if (key === "defaultPage") {
          Router.setDefaultPage && Router.setDefaultPage(this.value);
        }
        if (typeof ToastSystem !== "undefined") ToastSystem.info(select.options[select.selectedIndex].text + " applied");
      });
    });
    var toggleThemeBtn = document.getElementById("toggleThemeBtn");
    if (toggleThemeBtn) toggleThemeBtn.addEventListener("click", function() {
      ThemeManager.toggle();
      var themeStatus = document.getElementById("themeStatus");
      if (themeStatus) themeStatus.textContent = ThemeManager.getCurrent() === "dark" ? "Dark" : "Light";
      ActivityLog.add("theme", "Theme changed to " + ThemeManager.getCurrent(), "theme");
      setTimeout(function() {
        window.dispatchEvent(new Event("resize"));
      }, 350);
    });
    var exportSettingsBtn = document.getElementById("exportSettingsBtn");
    if (exportSettingsBtn) exportSettingsBtn.addEventListener("click", function() {
      ExportManager.exportSettings();
    });
    var importSettingsBtn = document.getElementById("importSettingsBtn");
    if (importSettingsBtn) importSettingsBtn.addEventListener("click", function() {
      var importFile = document.getElementById("importSettingsFile");
      if (importFile) importFile.click();
    });
    var importSettingsFile = document.getElementById("importSettingsFile");
    if (importSettingsFile) importSettingsFile.addEventListener("change", function() {
      if (this.files && this.files[0]) ExportManager.importSettings(this.files[0]);
      this.value = "";
    });
    var saveSettingsBtn = document.getElementById("saveSettingsBtn");
    if (saveSettingsBtn) saveSettingsBtn.addEventListener("click", function() {
      if (typeof ToastSystem !== "undefined") ToastSystem.success("Settings saved successfully");
      ActivityLog.add("edit", "Settings updated", "edit");
    });
    var resetSettingsBtn = document.getElementById("resetSettingsBtn");
    if (resetSettingsBtn) resetSettingsBtn.addEventListener("click", function() {
      ModalSystem.confirm("Reset Settings", "Are you sure you want to reset all settings to their default values?", "Reset", "Cancel", function() {
        AppStore.updateState("settings", {
          emailNotifications: true,
          pushNotifications: false,
          weeklyDigest: true,
          twoFactorAuth: false,
          autoSave: true,
          compactView: false,
          currency: "USD",
          timezone: "UTC",
          language: "en",
          density: "comfortable",
          accentColor: "indigo",
          animations: true,
          reducedMotion: false,
          dateFormat: "MMM D, YYYY",
          defaultPage: "analytics",
          sidebarCollapsed: false,
          showActivityLog: true,
          showQuickActions: true
        });
        applySettingsOnLoad();
        if (typeof ToastSystem !== "undefined") ToastSystem.success("Settings reset to defaults");
      });
    });
    applySettingsOnLoad();
    return function cleanup() {
      var resetBtn = document.getElementById("resetSettingsBtn");
      if (resetBtn) resetBtn.onclick = null;
    };
  }
  function applySettingsOnLoad() {
    var settings = AppStore.getState("settings");
    if (settings.accentColor) applyAccentColor(settings.accentColor);
    if (settings.density) applyDensity(settings.density);
    if (settings.animations === false) document.documentElement.classList.add("no-animations");
    if (settings.compactView) document.documentElement.classList.add("compact-view");
    if (settings.reducedMotion) document.documentElement.classList.add("reduced-motion");
    if (settings.sidebarCollapsed) {
      var sb = document.querySelector(".sidebar");
      if (sb) sb.classList.add("collapsed");
    }
  }
  function applyAccentColor(color) {
    var map = {
      indigo: ["#6366f1", "#4f46e5"],
      blue: ["#3b82f6", "#2563eb"],
      green: ["#10b981", "#059669"],
      purple: ["#8b5cf6", "#7c3aed"],
      orange: ["#f59e0b", "#d97706"],
      red: ["#ef4444", "#dc2626"]
    };
    var colors = map[color] || map.indigo;
    document.documentElement.style.setProperty("--clr-primary", colors[0]);
    document.documentElement.style.setProperty("--clr-primary-hover", colors[1]);
  }
  function applyDensity(density) {
    var map = {
      comfortable: { sidebar: "280px", header: "68px", content: "32px", gap: "24px" },
      cozy: { sidebar: "240px", header: "60px", content: "24px", gap: "20px" },
      compact: { sidebar: "200px", header: "52px", content: "16px", gap: "16px" }
    };
    var d = map[density] || map.comfortable;
    document.documentElement.style.setProperty("--sidebar-width", d.sidebar);
    document.documentElement.style.setProperty("--header-height", d.header);
    var content = document.querySelector(".content");
    if (content) {
      content.style.padding = d.content;
      content.style.gap = d.gap;
    }
  }
  return typeof BaseComponent !== "undefined" ? BaseComponent.create({ render, init }) : { render, init };
})();
