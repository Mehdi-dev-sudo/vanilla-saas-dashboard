const SettingsPage = (function () {

  function render() {
    var settings = AppStore.getState('settings');

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
            <span style="font-size:var(--font-sm);color:var(--text-secondary)" id="themeStatus">${ThemeManager.getCurrent() === 'dark' ? 'Dark' : 'Light'}</span>
            <button class="btn btn--sm btn--secondary" id="toggleThemeBtn">Toggle</button>
          </div>
        </div>
        ${renderSelect('language', 'Language', 'Interface language', settings.language || 'en', { en: 'English', fa: 'Persian (RTL)', de: 'Deutsch', fr: 'Francais', es: 'Espanol' })}
        ${renderSelect('density', 'Density', 'Controls the spacing in the interface', settings.density || 'comfortable', { comfortable: 'Comfortable', compact: 'Compact', cozy: 'Cozy' })}
        ${renderSelect('accentColor', 'Accent Color', 'Primary brand color', settings.accentColor || 'indigo', { indigo: 'Indigo', blue: 'Blue', green: 'Green', purple: 'Purple', orange: 'Orange', red: 'Red' })}
        ${renderToggle('animations', 'Animations', 'Enable UI animations and transitions', settings.animations !== false)}
      </div>

      <div class="settings-section" style="margin-top:var(--space-xl)">
        <div class="settings-section__header">
          <h3 class="settings-section__title">Notifications</h3>
          <p class="settings-section__desc">Configure how you receive notifications</p>
        </div>
        ${renderToggle('emailNotifications', 'Email Notifications', 'Receive email alerts for important updates', settings.emailNotifications)}
        ${renderToggle('pushNotifications', 'Push Notifications', 'Receive push notifications in your browser', settings.pushNotifications)}
        ${renderToggle('weeklyDigest', 'Weekly Digest', 'Receive a weekly summary of your account activity', settings.weeklyDigest)}
      </div>

      <div class="settings-section" style="margin-top:var(--space-xl)">
        <div class="settings-section__header">
          <h3 class="settings-section__title">Dashboard</h3>
          <p class="settings-section__desc">Configure your dashboard layout</p>
        </div>
        ${renderToggle('compactView', 'Compact View', 'Use a more compact layout with less spacing', settings.compactView)}
        ${renderToggle('autoSave', 'Auto-Save', 'Automatically save changes as you work', settings.autoSave)}
        ${renderToggle('showActivityLog', 'Activity Log', 'Show recent activity on dashboard', settings.showActivityLog !== false)}
        ${renderToggle('showQuickActions', 'Quick Actions', 'Show quick action buttons on dashboard', settings.showQuickActions !== false)}
      </div>

      <div class="settings-section" style="margin-top:var(--space-xl)">
        <div class="settings-section__header">
          <h3 class="settings-section__title">Account</h3>
          <p class="settings-section__desc">Your account information</p>
        </div>
        <div class="settings-row">
          <div class="settings-row__info">
            <div class="settings-row__label">Name</div>
            <div class="settings-row__desc" id="settingsUserName">${AuthManager.isLoggedIn && AuthManager.getUser() ? AuthManager.getUser().name : '—'}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row__info">
            <div class="settings-row__label">Email</div>
            <div class="settings-row__desc" id="settingsUserEmail">${AuthManager.isLoggedIn && AuthManager.getUser() ? AuthManager.getUser().email : '—'}</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row__info">
            <div class="settings-row__label">Plan</div>
            <div class="settings-row__desc">Enterprise Plan</div>
          </div>
          <button class="btn btn--sm btn--primary">Upgrade</button>
        </div>
      </div>

      <div class="settings-actions" style="margin-top:var(--space-xl)">
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
        <div class="toggle${value ? ' active' : ''}" data-setting="${key}" role="switch" aria-checked="${value}" tabindex="0">
          <div class="toggle__track"></div>
        </div>
      </div>
    `;
  }

  function renderSelect(key, label, desc, value, options) {
    var opts = Object.keys(options).map(function (k) {
      return '<option value="' + k + '"' + (k === value ? ' selected' : '') + '>' + options[k] + '</option>';
    }).join('');
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
    document.querySelectorAll('.toggle[data-setting]').forEach(function (toggle) {
      var key = toggle.dataset.setting;
      function toggleActive() {
        toggle.classList.toggle('active');
        var isActive = toggle.classList.contains('active');
        toggle.setAttribute('aria-checked', isActive);
        AppStore.updateState('settings', (function (o) { o[key] = isActive; return o; })({}));
        if (key === 'animations') document.documentElement.classList.toggle('no-animations', !isActive);
        if (key === 'compactView') document.documentElement.classList.toggle('compact-view', isActive);
      }
      toggle.addEventListener('click', toggleActive);
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleActive(); }
      });
    });

    document.querySelectorAll('[data-setting-select]').forEach(function (select) {
      var key = select.dataset.settingSelect;
      select.addEventListener('change', function () {
        AppStore.updateState('settings', (function (o) { o[key] = this.value; return o; })({}));
        if (key === 'accentColor') applyAccentColor(this.value);
        if (key === 'density') applyDensity(this.value);
        ToastSystem.info(select.options[select.selectedIndex].text + ' applied');
      });
    });

    document.getElementById('toggleThemeBtn').addEventListener('click', function () {
      ThemeManager.toggle();
      document.getElementById('themeStatus').textContent = ThemeManager.getCurrent() === 'dark' ? 'Dark' : 'Light';
      ActivityLog.add('theme', 'Theme changed to ' + ThemeManager.getCurrent(), 'theme');
      setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 350);
    });

    document.getElementById('saveSettingsBtn').addEventListener('click', function () {
      ToastSystem.success('Settings saved successfully');
      ActivityLog.add('edit', 'Settings updated', 'edit');
    });

    document.getElementById('resetSettingsBtn').addEventListener('click', function () {
      ModalSystem.confirm('Reset Settings', 'Are you sure you want to reset all settings to their default values?', 'Reset', 'Cancel', function () {
        AppStore.updateState('settings', {
          emailNotifications: true, pushNotifications: false, weeklyDigest: true,
          twoFactorAuth: false, autoSave: true, compactView: false,
          currency: 'USD', timezone: 'UTC', language: 'en',
          density: 'comfortable', accentColor: 'indigo', animations: true,
          showActivityLog: true, showQuickActions: true
        });
        SettingsPage.init();
        ToastSystem.success('Settings reset to defaults');
      });
    });

    applySettingsOnLoad();

    return function cleanup() {};
  }

  function applySettingsOnLoad() {
    var settings = AppStore.getState('settings');
    if (settings.accentColor) applyAccentColor(settings.accentColor);
    if (settings.density) applyDensity(settings.density);
    if (settings.animations === false) document.documentElement.classList.add('no-animations');
    if (settings.compactView) document.documentElement.classList.add('compact-view');
  }

  function applyAccentColor(color) {
    var map = {
      indigo: ['#6366f1', '#4f46e5'],
      blue: ['#3b82f6', '#2563eb'],
      green: ['#10b981', '#059669'],
      purple: ['#8b5cf6', '#7c3aed'],
      orange: ['#f59e0b', '#d97706'],
      red: ['#ef4444', '#dc2626']
    };
    var colors = map[color] || map.indigo;
    document.documentElement.style.setProperty('--clr-primary', colors[0]);
    document.documentElement.style.setProperty('--clr-primary-hover', colors[1]);
  }

  function applyDensity(density) {
    var map = {
      comfortable: { sidebar: '280px', header: '68px', content: '32px', gap: '24px' },
      cozy: { sidebar: '240px', header: '60px', content: '24px', gap: '20px' },
      compact: { sidebar: '200px', header: '52px', content: '16px', gap: '16px' }
    };
    var d = map[density] || map.comfortable;
    document.documentElement.style.setProperty('--sidebar-width', d.sidebar);
    document.documentElement.style.setProperty('--header-height', d.header);
    document.querySelector('.content').style.padding = d.content;
    document.querySelector('.content').style.gap = d.gap;
  }

  return { render: render, init: init };
})();
