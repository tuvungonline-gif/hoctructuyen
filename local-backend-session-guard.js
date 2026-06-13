(function localBackendSessionGuard() {
  const SESSION_KEY = "eduvideo_production_session_v1";

  function readJson(value) {
    try { return JSON.parse(value || "{}"); } catch (error) { return {}; }
  }

  function hasBackendSession() {
    const session = readJson(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY));
    return Boolean(session.accessToken && session.user);
  }

  async function isLocalBackendReady() {
    try {
      const response = await fetch("/api/config", { cache: "no-store" });
      const config = await response.json();
      return Boolean(config.productionReady && config.authMode === "local");
    } catch (error) {
      return false;
    }
  }

  async function guardDemoAutoLogin() {
    if (!(await isLocalBackendReady())) return;
    if (hasBackendSession()) return;
    if (typeof state === "undefined" || !state) return;
    if (!state.currentUserId) return;
    state.currentUserId = "";
    if (typeof saveState === "function") saveState();
    if (typeof render === "function") render();
  }

  window.addEventListener("hashchange", function () {
    setTimeout(guardDemoAutoLogin, 80);
  });
  setTimeout(guardDemoAutoLogin, 700);
})();
