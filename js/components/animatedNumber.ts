/**
 * AnimatedNumber — Number counter with animation.
 * @module AnimatedNumber
 */
const AnimatedNumber = (function () {
  function animate(el, from, to, duration, prefix, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    duration = duration || 1000;
    var start = performance.now();
    function tick(now) {
      var pct = Math.min(1, (now - start) / duration);
      var val = Math.round(from + (to - from) * easeOutCubic(pct));
      el.textContent = prefix + val.toLocaleString() + suffix;
      if (pct < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  return { animate: animate };
})();