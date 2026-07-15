const I18n = (function () {
  var locale = 'en';
  var fallback = 'en';
  var translations = {};
  var rtlLocales = { fa: true, ar: true, he: true };
  var initialized = false;

  var formatCache = {};

  function init() {
    var saved = AppStore && AppStore.getState ? AppStore.getState('settings') : null;
    var lang = saved && saved.language ? saved.language : navigator.language.slice(0, 2);
    if (!translations[lang]) lang = fallback;
    setLocale(lang);
    initialized = true;
  }

  function setLocale(lang) {
    if (!translations[lang]) return;
    locale = lang;
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = rtlLocales[lang] ? 'rtl' : 'ltr';
      document.documentElement.classList.toggle('rtl', !!rtlLocales[lang]);
    }
    formatCache = {};
  }

  function getLocale() { return locale; }

  function __(key, params) {
    var parts = key.split('.');
    var val = translations[locale];
    var i;
    for (i = 0; val && i < parts.length; i++) val = val[parts[i]];
    if (val === undefined) {
      val = translations[fallback];
      for (i = 0; val && i < parts.length; i++) val = val[parts[i]];
    }
    if (val === undefined) return key;
    if (params) {
      for (var p in params) {
        val = val.replace(new RegExp('\\{' + p + '\\}', 'g'), params[p]);
      }
    }
    return val;
  }

  function t(key, params) { return __(key, params); }

  function getNumberFormat() {
    if (formatCache.number) return formatCache.number;
    var localeMap = { en: 'en-US', fa: 'fa-IR', de: 'de-DE', fr: 'fr-FR', es: 'es-ES' };
    formatCache.number = localeMap[locale] || 'en-US';
    return formatCache.number;
  }

  function formatDate(dateStr, options) {
    var d = new Date(dateStr);
    try { return d.toLocaleDateString(getNumberFormat(), options || { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch (e) { return d.toDateString(); }
  }

  function formatCurrency(amount, currency) {
    currency = currency || 'USD';
    try { return new Intl.NumberFormat(getNumberFormat(), { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(amount); }
    catch (e) { return '$' + Number(amount).toLocaleString(); }
  }

  function formatNumber(num) {
    try { return new Intl.NumberFormat(getNumberFormat()).format(num); }
    catch (e) { return Number(num).toLocaleString(); }
  }

  function isRTL() { return !!rtlLocales[locale]; }

  function registerTranslations(lang, data) {
    translations[lang] = data;
  }

  return {
    init: init,
    setLocale: setLocale,
    getLocale: getLocale,
    __: __,
    t: t,
    formatDate: formatDate,
    formatCurrency: formatCurrency,
    formatNumber: formatNumber,
    isRTL: isRTL,
    registerTranslations: registerTranslations
  };
})();

window.__ = I18n.__;
window.__t = I18n.t;
