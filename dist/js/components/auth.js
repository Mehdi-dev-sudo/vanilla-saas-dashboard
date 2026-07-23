const AuthManager = /* @__PURE__ */ (function() {
  var SESSION_KEY = "saas_auth_session";
  var REMEMBER_KEY = "saas_auth_remember";
  var CREDENTIALS_KEY = "saas_auth_credentials";
  var isAuthenticated = false;
  var currentUser = null;
  function init() {
    checkSession();
    if (isAuthenticated) {
      updateUserDisplay();
    }
    var logoutBtn = document.getElementById("sidebarLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function(e) {
        e.preventDefault();
        logout();
      });
    }
  }
  function checkSession() {
    var session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        currentUser = JSON.parse(session);
        isAuthenticated = true;
        return true;
      } catch (e) {
      }
    }
    var remember = SafeStorage.getItem(REMEMBER_KEY);
    if (remember === "true") {
      var credentials = SafeStorage.getItem(CREDENTIALS_KEY);
      if (credentials) {
        try {
          var cred = JSON.parse(credentials);
          currentUser = {
            username: cred.username,
            name: cred.name || cred.username,
            email: cred.email || "",
            role: "Admin"
          };
          isAuthenticated = true;
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
          return true;
        } catch (e) {
        }
      }
    }
    return false;
  }
  function login(username, password, remember) {
    if (!username || !password) {
      return { success: false, error: __("auth.validation.allFields") };
    }
    if (password.length < 3) {
      return { success: false, error: __("auth.validation.passwordLength") };
    }
    currentUser = {
      username,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email: username.toLowerCase() + "@saasify.com",
      role: "Admin",
      loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    isAuthenticated = true;
    if (remember) {
      SafeStorage.setItem(REMEMBER_KEY, "true");
      SafeStorage.setObject(CREDENTIALS_KEY, {
        username,
        name: currentUser.name,
        email: currentUser.email
      });
    } else {
      SafeStorage.removeItem(REMEMBER_KEY);
      SafeStorage.removeItem(CREDENTIALS_KEY);
    }
    updateUserDisplay();
    if (typeof ActivityLog !== "undefined") {
      ActivityLog.add("auth", 'User "' + username + '" logged in', "auth");
    }
    return { success: true };
  }
  function logout() {
    if (typeof ModalSystem !== "undefined") {
      ModalSystem.confirm("Sign Out", "Are you sure you want to sign out?", "Sign Out", "Cancel", function() {
        doLogout();
      });
    } else {
      doLogout();
    }
  }
  function doLogout() {
    if (typeof ActivityLog !== "undefined") {
      ActivityLog.add("auth", "User logged out", "auth");
    }
    sessionStorage.removeItem(SESSION_KEY);
    isAuthenticated = false;
    currentUser = null;
    if (!SafeStorage.getItem(REMEMBER_KEY)) {
      SafeStorage.removeItem(CREDENTIALS_KEY);
    }
    Router.navigate("login");
  }
  function isLoggedIn() {
    return isAuthenticated;
  }
  function getUser() {
    return currentUser || { name: "Guest", username: "guest", email: "", role: "Viewer" };
  }
  function getLoginPage() {
    return [
      '<div class="auth-page">',
      '<div class="auth-card">',
      '<div class="auth-card__header">',
      '<svg class="auth-logo" width="48" height="48" viewBox="0 0 32 32" fill="none">',
      '<rect width="32" height="32" rx="8" fill="url(#auth-gradient)"/>',
      '<path d="M10 22V16L16 10L22 16V22H18V18H14V22H10Z" fill="white"/>',
      "<defs>",
      '<linearGradient id="auth-gradient" x1="0" y1="0" x2="32" y2="32">',
      '<stop stop-color="#6366f1"/>',
      '<stop offset="1" stop-color="#8b5cf6"/>',
      "</linearGradient>",
      "</defs>",
      "</svg>",
      '<h1 class="auth-card__title">' + __("auth.login.title") + "</h1>",
      '<p class="auth-card__subtitle">' + __("auth.login.subtitle") + "</p>",
      "</div>",
      '<form class="auth-card__body" id="loginForm">',
      '<div class="form-group">',
      '<label class="form-label" for="loginUsername">' + __("auth.login.usernameLabel") + "</label>",
      '<input type="text" class="form-input" id="loginUsername" name="username" placeholder="' + __("auth.login.usernamePlaceholder") + '" autocomplete="username" required autofocus>',
      "</div>",
      '<div class="form-group">',
      '<label class="form-label" for="loginPassword">' + __("auth.login.passwordLabel") + "</label>",
      '<input type="password" class="form-input" id="loginPassword" name="password" placeholder="' + __("auth.login.passwordPlaceholder") + '" autocomplete="current-password" required>',
      "</div>",
      '<div class="auth-card__options">',
      '<label class="toggle" id="rememberToggle">',
      '<div class="toggle__track"></div>',
      '<span style="font-size:var(--font-sm);color:var(--text-secondary)">' + __("auth.login.rememberMe") + "</span>",
      "</label>",
      `<a href="#" class="auth-card__forgot" onclick="ToastSystem.info('` + (typeof Utils !== "undefined" ? Utils.escapeHtml(__("auth.login.noPasswordReset")) : __("auth.login.noPasswordReset")) + `')">` + __("auth.login.forgotPassword") + "</a>",
      "</div>",
      '<button type="submit" class="btn btn--primary btn--lg auth-card__btn">' + __("auth.login.signIn") + "</button>",
      '<div class="auth-card__error" id="loginError" style="display:none"></div>',
      "</form>",
      '<div class="auth-card__footer">',
      '<span style="font-size:var(--font-sm);color:var(--text-tertiary)">' + __("auth.login.demoHint") + "</span>",
      "</div>",
      "</div>",
      "</div>"
    ].join("\n");
  }
  function initLoginPage() {
    var form = document.getElementById("loginForm");
    var errorEl = document.getElementById("loginError");
    var rememberToggle = document.getElementById("rememberToggle");
    var remember = false;
    if (rememberToggle) {
      rememberToggle.addEventListener("click", function() {
        remember = !remember;
        this.classList.toggle("active", remember);
      });
    }
    if (!form) return;
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      if (errorEl) errorEl.style.display = "none";
      var usernameEl = document.getElementById("loginUsername");
      var passwordEl = document.getElementById("loginPassword");
      if (!usernameEl || !passwordEl) return;
      var username = usernameEl.value.trim();
      var password = passwordEl.value;
      var result = login(username, password, remember);
      if (result.success) {
        Router.navigate("dashboard");
        ToastSystem.success("Welcome, " + (currentUser ? currentUser.name : username) + "!");
      } else {
        errorEl.textContent = result.error;
        errorEl.style.display = "block";
      }
    });
    return function cleanup() {
    };
  }
  function updateUserDisplay() {
    if (!isAuthenticated || !currentUser) return;
    var user = currentUser;
    var nameParts = user.name.split(" ");
    var initials = nameParts.map(function(n) {
      return n[0];
    }).join("").slice(0, 2).toUpperCase();
    var userNameEls = document.querySelectorAll(".sidebar__user-name, #sidebarUserName, .header__profile-name, #headerUserName");
    userNameEls.forEach(function(el) {
      if (el) el.textContent = user.name;
    });
    var avatarEls = document.querySelectorAll(".sidebar__user-avatar span, #sidebarAvatar, .header__avatar span, #headerAvatar");
    avatarEls.forEach(function(el) {
      if (el) el.textContent = initials;
    });
    var roleEls = document.querySelectorAll(".sidebar__user-role, #sidebarUserRole");
    roleEls.forEach(function(el) {
      if (el) el.textContent = user.role;
    });
    var settingsName = document.getElementById("settingsUserName");
    if (settingsName) settingsName.textContent = user.name;
    var settingsEmail = document.getElementById("settingsUserEmail");
    if (settingsEmail) settingsEmail.textContent = user.email;
  }
  return {
    init,
    login,
    logout,
    isLoggedIn,
    getUser,
    getLoginPage,
    initLoginPage,
    updateUserDisplay
  };
})();
