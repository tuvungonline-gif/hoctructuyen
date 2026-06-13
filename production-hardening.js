(function productionHardening() {
  const SESSION_KEY = "eduvideo_production_session_v1";
  const CONFIG_KEY = "eduvideo_production_config_v1";
  const FETCH_TIMEOUT_MS = 30000;
  let configCache = null;

  function safeJsonParse(value, fallback) {
    try { return JSON.parse(value || ""); } catch (error) { return fallback; }
  }

  function storageGet(key) {
    try { return localStorage.getItem(key) || sessionStorage.getItem(key) || ""; } catch (error) { return ""; }
  }

  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (error) { try { sessionStorage.setItem(key, value); } catch (innerError) {} }
  }

  function storageRemove(key) {
    try { localStorage.removeItem(key); } catch (error) {}
    try { sessionStorage.removeItem(key); } catch (error) {}
  }

  function saveSession(data) {
    storageSet(SESSION_KEY, JSON.stringify({
      accessToken: data.accessToken || "",
      refreshToken: data.refreshToken || "",
      expiresAt: data.expiresAt || null,
      user: data.user || null,
      profile: data.profile || null,
      savedAt: Date.now()
    }));
  }

  function loadSession() {
    return safeJsonParse(storageGet(SESSION_KEY), null);
  }

  function friendlyMessage(message) {
    const text = String(message || "");
    if (text.includes("Unexpected token") || text.includes("is not valid JSON")) {
      return "Máy chủ đang trả về HTML hoặc trang lỗi thay vì JSON. Vui lòng kiểm tra URL API, route deploy và biến môi trường.";
    }
    if (/Failed to fetch|NetworkError|Load failed/i.test(text)) {
      return "Không kết nối được máy chủ. Vui lòng kiểm tra deploy, CORS hoặc kết nối mạng.";
    }
    if (/Admin permission required/i.test(text)) {
      return "Tài khoản hiện tại chưa có quyền quản trị. Hãy đăng nhập admin nội bộ hoặc cấu hình ADMIN_TOKEN.";
    }
    if (/Login required/i.test(text)) {
      return "Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập. Vui lòng đăng nhập lại.";
    }
    return text || "Có lỗi xảy ra. Vui lòng thử lại.";
  }

  function showNotice(message, type) {
    const existing = document.querySelector("#productionNotice");
    const notice = existing || document.createElement("div");
    notice.id = "productionNotice";
    notice.className = `production-notice ${type || "info"}`;
    notice.innerHTML = `<span>${message}</span><button type="button" aria-label="Đóng thông báo">×</button>`;
    notice.querySelector("button").onclick = function () { notice.remove(); };
    if (!existing) document.body.appendChild(notice);
  }

  function injectStyles() {
    if (document.querySelector("#productionHardeningStyle")) return;
    const style = document.createElement("style");
    style.id = "productionHardeningStyle";
    style.textContent = `
      .production-notice{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;display:flex;gap:12px;align-items:center;justify-content:space-between;max-width:760px;margin:auto;padding:14px 16px;border-radius:18px;border:1px solid #bfdbfe;background:#eff6ff;color:#1e3a8a;box-shadow:0 18px 60px rgba(15,23,42,.18);font-weight:700}
      .production-notice.error{border-color:#fecaca;background:#fef2f2;color:#991b1b}.production-notice.warning{border-color:#fde68a;background:#fffbeb;color:#92400e}.production-notice.success{border-color:#bbf7d0;background:#f0fdf4;color:#166534}
      .production-notice button{width:34px;height:34px;border:0;border-radius:999px;background:rgba(15,23,42,.08);font-size:22px;line-height:1;cursor:pointer}
      body.production-ready .demo-login-grid,body.production-ready .demo-note{display:none!important}
      body.production-ready .hero-stats .stat:first-child span{font-size:0}body.production-ready .hero-stats .stat:first-child span:after{content:'local backend';font-size:.86rem}
      .media-fallback{display:flex;align-items:center;justify-content:center;min-height:160px;border-radius:18px;background:#f1f5f9;color:#475569;text-align:center;padding:18px;font-weight:800}
      @media(max-width:560px){.production-notice{left:10px;right:10px;bottom:10px;align-items:flex-start;font-size:.92rem}}
    `;
    document.head.appendChild(style);
  }

  function isApiRequest(input) {
    const raw = typeof input === "string" ? input : input?.url || "";
    try {
      const url = new URL(raw, window.location.origin);
      return url.origin === window.location.origin && url.pathname.startsWith("/api/");
    } catch (error) {
      return false;
    }
  }

  function installFetchGuard() {
    if (window.__EDU_FETCH_GUARD__) return;
    window.__EDU_FETCH_GUARD__ = true;
    const nativeFetch = window.fetch.bind(window);
    window.fetch = async function guardedFetch(input, init) {
      const needsGuard = isApiRequest(input);
      const controller = needsGuard && typeof AbortController !== "undefined" ? new AbortController() : null;
      const timer = controller ? setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS) : null;
      const nextInit = controller ? { ...(init || {}), signal: init?.signal || controller.signal } : init;
      try {
        const response = await nativeFetch(input, nextInit);
        if (!needsGuard || typeof Response === "undefined") return response;
        const type = response.headers.get("content-type") || "";
        if (type.includes("application/json")) return response;
        const text = await response.clone().text().catch(() => "");
        const looksHtml = /^\s*<!doctype html|^\s*<html|^\s*<body|^\s*A server error/i.test(text);
        if (looksHtml || !type) {
          const status = response.ok ? 502 : response.status;
          const body = JSON.stringify({ error: "Server returned non-JSON response", detail: "API đang trả HTML/text thay vì JSON. Kiểm tra route API, proxy, CORS hoặc cấu hình deploy." });
          return new Response(body, { status, headers: { "content-type": "application/json" } });
        }
        return response;
      } catch (error) {
        if (needsGuard && error.name === "AbortError") throw new Error("API timeout sau 30 giây. Vui lòng kiểm tra backend hoặc mạng.");
        throw error;
      } finally {
        if (timer) clearTimeout(timer);
      }
    };
  }

  async function readJsonResponse(response) {
    const text = await response.text();
    const json = safeJsonParse(text, null);
    if (!json) throw new Error("Server returned non-JSON response");
    if (!response.ok) throw new Error(json.error || `HTTP ${response.status}`);
    return json;
  }

  async function apiFetch(url, options) {
    const session = loadSession();
    const headers = { ...(options?.headers || {}) };
    if (!headers["Content-Type"] && options?.body) headers["Content-Type"] = "application/json";
    if (session?.accessToken && !headers.Authorization) headers.Authorization = `Bearer ${session.accessToken}`;
    const response = await fetch(url, { ...(options || {}), headers, cache: "no-store" });
    return readJsonResponse(response);
  }

  async function loadConfig(force) {
    if (configCache && !force) return configCache;
    const saved = safeJsonParse(storageGet(CONFIG_KEY), null);
    if (saved && !force) configCache = saved;
    try {
      const response = await fetch("/api/config", { cache: "no-store" });
      const json = await readJsonResponse(response);
      configCache = json;
      storageSet(CONFIG_KEY, JSON.stringify(json));
      document.body.classList.toggle("production-ready", Boolean(json.productionReady));
      document.body.classList.toggle("demo-mode", !json.productionReady);
      return json;
    } catch (error) {
      if (saved) return saved;
      return { productionReady: false, r2Ready: false, videoMode: "demo", authMode: "demo" };
    }
  }

  function normalizeProdUser(user, profile) {
    return {
      id: user?.id || `prod-${Date.now()}`,
      name: user?.name || user?.email || "Học viên",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      role: user?.role || profile?.role || "student",
      status: user?.status || profile?.status || "active",
      source: "local-backend"
    };
  }

  function applyProductionUser(user, profile) {
    if (typeof state === "undefined" || !state || !Array.isArray(state.users)) return;
    const nextUser = normalizeProdUser(user, profile);
    const currentIndex = state.users.findIndex((item) => item.id === nextUser.id || item.email === nextUser.email);
    if (currentIndex >= 0) state.users[currentIndex] = { ...state.users[currentIndex], ...nextUser };
    else state.users.push(nextUser);
    state.currentUserId = nextUser.id;
    if (typeof saveState === "function") saveState();
  }

  function setSubmitLoading(form, loading) {
    if (!form) return;
    const button = form.querySelector('button[type="submit"]');
    if (!button) return;
    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = "Đang xử lý...";
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  }

  function installAuthBridge() {
    const demoLogin = window.handleLogin;
    const demoRegister = window.handleRegister;
    const demoLogout = window.logoutUser;

    window.handleLogin = async function productionLogin(event) {
      event.preventDefault();
      const formEl = event.currentTarget;
      const form = new FormData(formEl);
      const email = String(form.get("email") || "").trim().toLowerCase();
      const password = String(form.get("password") || "");
      const cfg = await loadConfig();
      if (!cfg.productionReady) return demoLogin ? demoLogin(event) : undefined;
      if (!email || !password) return alert("Vui lòng nhập email và mật khẩu.");
      try {
        setSubmitLoading(formEl, true);
        const result = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
        saveSession(result);
        applyProductionUser(result.user, result.profile);
        showNotice("Đăng nhập thành công.", "success");
        window.location.hash = (result.user?.role || result.profile?.role) === "admin" ? "#/admin" : "#/account";
        if (typeof render === "function") render();
      } catch (error) {
        showNotice(friendlyMessage(error.message), "error");
      } finally {
        setSubmitLoading(formEl, false);
      }
    };

    window.handleRegister = async function productionRegister(event) {
      event.preventDefault();
      const formEl = event.currentTarget;
      const form = new FormData(formEl);
      const name = String(form.get("name") || "").trim();
      const email = String(form.get("email") || "").trim().toLowerCase();
      const phone = String(form.get("phone") || "").trim();
      const password = String(form.get("password") || "");
      const cfg = await loadConfig();
      if (!cfg.productionReady) return demoRegister ? demoRegister(event) : undefined;
      if (!name || !email || password.length < 6) return alert("Vui lòng nhập đủ họ tên, email và mật khẩu tối thiểu 6 ký tự.");
      try {
        setSubmitLoading(formEl, true);
        const result = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, phone, password }) });
        if (result.accessToken) saveSession(result);
        applyProductionUser(result.user, result.profile);
        showNotice("Tạo tài khoản thành công.", "success");
        window.location.hash = "#/account";
        if (typeof render === "function") render();
      } catch (error) {
        showNotice(friendlyMessage(error.message), "error");
      } finally {
        setSubmitLoading(formEl, false);
      }
    };

    window.logoutUser = function productionLogout() {
      storageRemove(SESSION_KEY);
      if (demoLogout) return demoLogout();
      window.location.hash = "#/auth";
    };
  }

  async function restoreSession() {
    const session = loadSession();
    if (!session?.accessToken || !session?.user) return;
    applyProductionUser(session.user, session.profile);
    try {
      const result = await apiFetch("/api/auth/me");
      saveSession({ ...session, user: result.user, profile: result.profile });
      applyProductionUser(result.user, result.profile);
    } catch (error) {
      storageRemove(SESSION_KEY);
    }
    if (typeof render === "function") render();
  }

  async function syncCoursesFromApi() {
    const cfg = await loadConfig();
    if (!cfg.productionReady) return;
    try {
      const result = await apiFetch("/api/courses");
      if (!Array.isArray(result.courses) || !result.courses.length) return;
      if (typeof courses !== "undefined" && Array.isArray(courses)) {
        courses.splice(0, courses.length, ...result.courses);
        if (typeof render === "function") render();
      }
    } catch (error) {
      console.warn("Không đồng bộ được khóa học từ backend local", error);
    }
  }

  function installMediaFallback() {
    document.addEventListener("error", function (event) {
      const target = event.target;
      if (!target || !["IMG", "VIDEO"].includes(target.tagName)) return;
      if (target.dataset.fallbackApplied) return;
      target.dataset.fallbackApplied = "1";
      const box = document.createElement("div");
      box.className = "media-fallback";
      box.textContent = target.tagName === "VIDEO" ? "Video chưa tải được. Vui lòng kiểm tra quyền học, signed URL hoặc cấu hình R2." : "Không tải được hình ảnh";
      if (target.tagName === "IMG") {
        target.alt = target.alt || "Không tải được hình ảnh";
        target.style.opacity = "0";
      }
      target.insertAdjacentElement("afterend", box);
    }, true);
  }

  function installGlobalErrorBoundary() {
    window.addEventListener("error", function (event) { showNotice(friendlyMessage(event.message), "error"); });
    window.addEventListener("unhandledrejection", function (event) { showNotice(friendlyMessage(event.reason?.message || event.reason), "error"); });
  }

  async function boot() {
    injectStyles();
    installFetchGuard();
    installMediaFallback();
    installGlobalErrorBoundary();
    installAuthBridge();
    await loadConfig(true);
    await restoreSession();
    await syncCoursesFromApi();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
