var AnimationEngine = (function () {
  var reducedMotion = false;

  // ---- Spring Physics ----
  function spring(value, target, velocity, stiffness, damping, precision) {
    stiffness = stiffness || 180;
    damping = damping || 12;
    precision = precision || 0.01;
    var x = value - target;
    if (Math.abs(x) < precision && Math.abs(velocity) < precision) {
      return { value: target, velocity: 0, done: true };
    }
    var dt = 1 / 60;
    var force = -stiffness * (value - target) - damping * velocity;
    velocity += force * dt;
    value += velocity * dt;
    return { value: value, velocity: velocity, done: false };
  }

  function animateSpring(el, prop, target, stiffness, damping, duration) {
    if (reducedMotion) { el.style[prop] = target; return; }
    var current = parseFloat(el.style[prop]) || 0;
    var velocity = 0;
    var start = null;
    duration = duration || 600;

    function frame(time) {
      if (!start) start = time;
      var result = spring(current, target, velocity, stiffness, damping);
      current = result.value;
      velocity = result.velocity;
      el.style[prop] = current + (typeof target === 'number' && target % 1 !== 0 ? 'px' : '');
      if (!result.done && time - start < duration) {
        requestAnimationFrame(frame);
      } else {
        el.style[prop] = target + (typeof target === 'number' && target % 1 !== 0 ? 'px' : '');
      }
    }
    requestAnimationFrame(frame);
  }

  // ---- FLIP Animation ----
  function flip(el, callback) {
    if (reducedMotion) { callback(); return; }
    var first = el.getBoundingClientRect();
    callback();
    var last = el.getBoundingClientRect();
    var dx = first.left - last.left;
    var dy = first.top - last.top;
    var dw = first.width / last.width;
    var dh = first.height / last.height;
    if (dx === 0 && dy === 0 && dw === 1 && dh === 1) return;
    el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(' + dw + ', ' + dh + ')';
    el.style.transformOrigin = '0 0';
    el.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    requestAnimationFrame(function () {
      el.style.transform = '';
    });
    el.addEventListener('transitionend', function handler() {
      el.style.transition = '';
      el.removeEventListener('transitionend', handler);
    }, { once: true });
  }

  function flipList(container, getKey, before, after) {
    if (reducedMotion) { after(); return; }
    var children = Array.from(container.children);
    var rects = {};
    children.forEach(function (child) {
      var key = getKey(child);
      rects[key] = child.getBoundingClientRect();
    });
    after();
    requestAnimationFrame(function () {
      children.forEach(function (child) {
        var key = getKey(child);
        var first = rects[key];
        if (!first) return;
        var last = child.getBoundingClientRect();
        var dx = first.left - last.left;
        var dy = first.top - last.top;
        if (dx === 0 && dy === 0) return;
        child.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
        child.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        requestAnimationFrame(function () {
          child.style.transform = '';
        });
        child.addEventListener('transitionend', function handler() {
          child.style.transition = '';
          child.removeEventListener('transitionend', handler);
        }, { once: true });
      });
    });
  }

  // ---- View Transition API ----
  function viewTransition(updateFn) {
    if (reducedMotion || typeof document.startViewTransition !== 'function') {
      updateFn();
      return Promise.resolve();
    }
    return document.startViewTransition(updateFn).finished;
  }

  // ---- Micro Interactions ----
  function microPulse(el) {
    if (reducedMotion) return;
    el.style.transform = 'scale(0.97)';
    el.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
    requestAnimationFrame(function () {
      el.style.transform = '';
    });
  }

  function microBounce(el) {
    if (reducedMotion) return;
    var keyframes = [
      { transform: 'scale(1)', offset: 0 },
      { transform: 'scale(1.15)', offset: 0.3 },
      { transform: 'scale(0.95)', offset: 0.6 },
      { transform: 'scale(1.05)', offset: 0.8 },
      { transform: 'scale(1)', offset: 1 }
    ];
    el.animate(keyframes, { duration: 400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
  }

  function microRipple(e, el) {
    if (reducedMotion) return;
    var rect = el.getBoundingClientRect();
    var x = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - rect.left;
    var y = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY) - rect.top;
    var size = Math.max(rect.width, rect.height) * 2;
    var ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;background:rgba(255,255,255,0.3);border-radius:50%;transform:translate(-50%,-50%) scale(0);animation:ripple-anim 0.6s ease-out forwards;pointer-events:none;';
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(ripple);
    ripple.addEventListener('animationend', function () { ripple.remove(); });
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = '@keyframes ripple-anim{to{transform:translate(-50%,-50%) scale(1);opacity:0}}';
    document.head.appendChild(style);

    var mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', function (e) { reducedMotion = e.matches; });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn:not(.btn--ghost), .card, .toggle');
      if (btn) microRipple(e, btn);
    });
  }

  return {
    init: init,
    flip: flip,
    flipList: flipList,
    viewTransition: viewTransition,
    spring: spring,
    animateSpring: animateSpring,
    microPulse: microPulse,
    microBounce: microBounce,
    microRipple: microRipple,
    get reducedMotion() { return reducedMotion; }
  };
})();
