const SettingsPage = (function () {

  function render() {
    const settings = AppStore.getState('settings');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Settings</h1>
          <p class="page-header__subtitle">Manage your application preferences</p>
        </div>
      </div>

      <div class="settings-section">
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
          <h3 class="settings-section__title">Preferences</h3>
          <p class="settings-section__desc">Customize your dashboard experience</p>
        </div>
        ${renderToggle('autoSave', 'Auto-Save', 'Automatically save changes as you work', settings.autoSave)}
        ${renderToggle('compactView', 'Compact View', 'Use a more compact layout with less spacing', settings.compactView)}
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
      </div>

      <div class="settings-section" style="margin-top:var(--space-xl)">
        <div class="settings-section__header">
          <h3 class="settings-section__title">Account</h3>
          <p class="settings-section__desc">Your account information</p>
        </div>
        <div class="settings-row">
          <div class="settings-row__info">
            <div class="settings-row__label">Name</div>
            <div class="settings-row__desc">Ali Rezaei</div>
          </div>
        </div>
        <div class="settings-row">
          <div class="settings-row__info">
            <div class="settings-row__label">Email</div>
            <div class="settings-row__desc">ali@example.com</div>
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

  function init() {
    document.querySelectorAll('.toggle[data-setting]').forEach(function (toggle) {
      const key = toggle.dataset.setting;

      function toggleActive() {
        toggle.classList.toggle('active');
        const isActive = toggle.classList.contains('active');
        toggle.setAttribute('aria-checked', isActive);
        AppStore.updateState('settings', { [key]: isActive });
      }

      toggle.addEventListener('click', toggleActive);
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleActive();
        }
      });
    });

    document.getElementById('toggleThemeBtn').addEventListener('click', function () {
      ThemeManager.toggle();
      document.getElementById('themeStatus').textContent = ThemeManager.getCurrent() === 'dark' ? 'Dark' : 'Light';
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'));
      }, 350);
    });

    document.getElementById('saveSettingsBtn').addEventListener('click', function () {
      ToastSystem.success('Settings saved successfully');
    });

    document.getElementById('resetSettingsBtn').addEventListener('click', function () {
      ModalSystem.confirm(
        'Reset Settings',
        'Are you sure you want to reset all settings to their default values?',
        'Reset',
        'Cancel',
        function () {
          AppStore.updateState('settings', {
            emailNotifications: true,
            pushNotifications: false,
            weeklyDigest: true,
            twoFactorAuth: false,
            autoSave: true,
            compactView: false,
            currency: 'USD',
            timezone: 'UTC'
          });
          SettingsPage.init();
          ToastSystem.success('Settings reset to defaults');
        }
      );
    });

    return function cleanup() {};
  }

  return { render, init };
})();
