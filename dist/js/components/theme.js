const ThemeManager = /* @__PURE__ */ (function() {
  const STORAGE_KEY = "saas_dashboard_theme";
  function init() {
    const saved = SafeStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    setTheme(theme);
    var toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) toggleBtn.addEventListener("click", toggle);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(e) {
      if (!SafeStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
  }
  function getCurrent() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    SafeStorage.setItem(STORAGE_KEY, theme);
    var toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) toggleBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
  function toggle() {
    const current = getCurrent();
    const next = current === "light" ? "dark" : "light";
    setTheme(next);
    if (typeof ActivityLog !== "undefined") ActivityLog.add("theme", "Theme changed to " + next, "theme");
  }
  return { init, getCurrent, setTheme, toggle };
})();
