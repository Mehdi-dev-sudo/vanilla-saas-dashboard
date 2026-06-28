const AuthManager = (function () {
  const SESSION_KEY = 'saas_auth_session';
  const REMEMBER_KEY = 'saas_auth_remember';
  const CREDENTIALS_KEY = 'saas_auth_credentials';

  let isAuthenticated = false;
  let currentUser = null;

  function init() {
    checkSession();
  }

  function checkSession() {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        currentUser = JSON.parse(session);
        isAuthenticated = true;
        return true;
      } catch (e) { /* ignore */ }
    }
    const remember = localStorage.getItem(REMEMBER_KEY);
    if (remember === 'true') {
      const credentials = localStorage.getItem(CREDENTIALS_KEY);
      if (credentials) {
        try {
          const cred = JSON.parse(credentials);
          currentUser = { username: cred.username, name: cred.name || cred.username, email: cred.email || '' };
          isAuthenticated = true;
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
          return true;
        } catch (e) { /* ignore */ }
      }
    }
    return false;
  }

  function login(username, password, remember) {
    if (!username || !password) {
      return { success: false, error: 'Please fill in all fields' };
    }
    if (password.length < 3) {
      return { success: false, error: 'Password must be at least 3 characters' };
    }

    currentUser = {
      username: username,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email: username.toLowerCase() + '@saasify.com',
      role: 'Admin',
      loggedInAt: new Date().toISOString()
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    isAuthenticated = true;

    if (remember) {
      localStorage.setItem(REMEMBER_KEY, 'true');
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ username: username, name: currentUser.name, email: currentUser.email }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem(CREDENTIALS_KEY);
    }

    ActivityLog.add('auth', 'User "' + username + '" logged in', 'auth');
    return { success: true };
  }

  function logout() {
    const username = currentUser ? currentUser.username : 'unknown';
    sessionStorage.removeItem(SESSION_KEY);
    isAuthenticated = false;
    currentUser = null;

    if (!localStorage.getItem(REMEMBER_KEY)) {
      localStorage.removeItem(CREDENTIALS_KEY);
    }

    ActivityLog.add('auth', 'User logged out', 'auth');
    Router.navigate('login');
  }

  function isLoggedIn() {
    return isAuthenticated;
  }

  function getUser() {
    return currentUser || { name: 'Guest', username: 'guest', email: '', role: 'Viewer' };
  }

  function getLoginPage() {
    return `
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-card__header">
            <svg class="auth-logo" width="48" height="48" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#auth-gradient)"/>
              <path d="M10 22V16L16 10L22 16V22H18V18H14V22H10Z" fill="white"/>
              <defs>
                <linearGradient id="auth-gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stop-color="#6366f1"/>
                  <stop offset="1" stop-color="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <h1 class="auth-card__title">Welcome to SaaSify</h1>
            <p class="auth-card__subtitle">Sign in to your dashboard</p>
          </div>
          <form class="auth-card__body" id="loginForm">
            <div class="form-group">
              <label class="form-label" for="loginUsername">Username</label>
              <input type="text" class="form-input" id="loginUsername" name="username" placeholder="Enter your username" autocomplete="username" required autofocus>
            </div>
            <div class="form-group">
              <label class="form-label" for="loginPassword">Password</label>
              <input type="password" class="form-input" id="loginPassword" name="password" placeholder="Enter your password" autocomplete="current-password" required>
            </div>
            <div class="auth-card__options">
              <label class="toggle" id="rememberToggle">
                <div class="toggle__track"></div>
                <span style="font-size:var(--font-sm);color:var(--text-secondary)">Remember me</span>
              </label>
              <a href="#" class="auth-card__forgot" onclick="ToastSystem.info('Password reset demo: This is a demo app')">Forgot password?</a>
            </div>
            <button type="submit" class="btn btn--primary btn--lg auth-card__btn">Sign In</button>
            <div class="auth-card__error" id="loginError" style="display:none"></div>
          </form>
          <div class="auth-card__footer">
            <span style="font-size:var(--font-sm);color:var(--text-tertiary)">Demo: any username / any password</span>
          </div>
        </div>
      </div>
    `;
  }

  function initLoginPage() {
    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');
    const rememberToggle = document.getElementById('rememberToggle');

    let remember = false;
    rememberToggle.addEventListener('click', function () {
      remember = !remember;
      this.classList.toggle('active', remember);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorEl.style.display = 'none';

      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;

      const result = login(username, password, remember);
      if (result.success) {
        Router.navigate('dashboard');
        ToastSystem.success('Welcome back, ' + username + '!');
      } else {
        errorEl.textContent = result.error;
        errorEl.style.display = 'block';
      }
    });

    updateUserDisplay();
  }

  function updateUserDisplay() {
    if (!isAuthenticated) return;
    const user = currentUser;
    const initials = user.name.split(' ').map(function (n) { return n[0]; }).join('').slice(0, 2).toUpperCase();
    document.querySelectorAll('.sidebar__user-name').forEach(function (el) { el.textContent = user.name; });
    document.querySelectorAll('.sidebar__user-avatar span').forEach(function (el) { el.textContent = initials; });
    document.querySelectorAll('.header__profile-name').forEach(function (el) { el.textContent = user.name; });
    document.querySelectorAll('.header__avatar span').forEach(function (el) { el.textContent = initials; });
    document.querySelectorAll('.sidebar__user-role').forEach(function (el) { el.textContent = user.role; });
  }

  function checkAuth(route) {
    if (route === 'login') return true;
    if (!isAuthenticated) {
      Router.navigate('login');
      return false;
    }
    return true;
  }

  return { init, login, logout, isLoggedIn, getUser, getLoginPage, initLoginPage, updateUserDisplay, checkAuth };
})();
