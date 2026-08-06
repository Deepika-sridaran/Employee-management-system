/**
 * Small fetch wrapper shared by every page.
 * All backend routes live under /api/... (see app.py + routes/*.py).
 */
const API_BASE = "/api";

const ELMS = {
  getToken() {
    return localStorage.getItem("elms_token");
  },
  setToken(token) {
    localStorage.setItem("elms_token", token);
  },
  clearToken() {
    localStorage.removeItem("elms_token");
    localStorage.removeItem("elms_user");
  },
  setUser(user) {
    localStorage.setItem("elms_user", JSON.stringify(user));
  },
  getUser() {
    const raw = localStorage.getItem("elms_user");
    return raw ? JSON.parse(raw) : null;
  },

  async request(path, { method = "GET", body = null, auth = true } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (auth && this.getToken()) {
      headers["Authorization"] = `Bearer ${this.getToken()}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    let data = {};
    try {
      data = await res.json();
    } catch (_) {
      /* empty body */
    }

    if (!res.ok) {
      const message = data.message || `Request failed (${res.status})`;
      throw new Error(message);
    }
    return data;
  },

  login(email, password) {
    return this.request("/auth/login", { method: "POST", body: { email, password }, auth: false });
  },
  register(payload) {
    return this.request("/auth/register", { method: "POST", body: payload, auth: false });
  },
  forgotPassword(email) {
    return this.request("/auth/forgot-password", { method: "POST", body: { email }, auth: false });
  },
  resetPassword(token, newPassword) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: { token, newPassword },
      auth: false,
    });
  },
  me() {
    return this.request("/auth/me");
  },
  dashboard() {
    return this.request("/dashboard");
  },
  pendingLeaves() {
    return this.request("/leaves/pending");
  },
  myLeaves(employeeId) {
    return this.request(`/employees/${employeeId}/leaves`);
  },
  leaveBalance(employeeId) {
    return this.request(`/leave-balances/${employeeId}`);
  },
};
