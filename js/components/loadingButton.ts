/**
 * LoadingButton — Button with loading spinner state.
 * @module LoadingButton
 */
const LoadingButton = (function () {
  function setLoading(btnId, loading) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    if (loading) {
      btn.classList.add('btn--loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('btn--loading');
      btn.disabled = false;
    }
  }
  return { setLoading: setLoading };
})();