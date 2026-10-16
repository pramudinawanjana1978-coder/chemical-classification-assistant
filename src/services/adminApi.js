// All admin API calls live here. The admin token is kept in sessionStorage
// (cleared when the tab closes); no credentials are stored in the frontend.
import { API_BASE_URL } from "./api.js";

const TOKEN_KEY = "chem_admin_token";

export class AdminApiError extends Error {
  constructor(message, status = 0, fields = null) {
    super(message);
    this.name = "AdminApiError";
    this.status = status; // 0 = network, otherwise HTTP status
    this.fields = fields; // per-field validation messages from Flask
  }
}

export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable: the session just won't survive a refresh */
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

async function adminRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AdminApiError("Could not reach the backend. Make sure the Flask server is running.", 0);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* non-JSON body */
  }

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && data.error) ||
      (response.status === 401
        ? "Unauthorized. Please log in again."
        : `The backend responded with an error (HTTP ${response.status}).`);
    throw new AdminApiError(message, response.status, data && data.fields ? data.fields : null);
  }

  if (data === null || typeof data !== "object") {
    throw new AdminApiError("The backend returned an invalid response.", response.status);
  }
  return data;
}

export async function adminLogin(username, password) {
  const data = await adminRequest("/api/admin/login", {
    method: "POST",
    body: { username, password },
    auth: false,
  });
  if (!data.token) throw new AdminApiError("The backend returned an invalid response.", 200);
  setToken(data.token);
  return data;
}

export async function adminLogout() {
  try {
    await adminRequest("/api/admin/logout", { method: "POST" });
  } catch {
    /* logging out locally is enough */
  }
  clearToken();
}

export async function fetchCategories() {
  const data = await adminRequest("/api/admin/categories");
  if (!Array.isArray(data.categories)) throw new AdminApiError("The backend returned an invalid response.", 200);
  return data.categories;
}

export async function fetchChemicals(query = "") {
  const qs = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
  const data = await adminRequest(`/api/admin/chemicals${qs}`);
  if (!Array.isArray(data.chemicals)) throw new AdminApiError("The backend returned an invalid response.", 200);
  return data.chemicals;
}

export const createChemical = (payload) =>
  adminRequest("/api/admin/chemicals", { method: "POST", body: payload });

export const updateChemical = (id, payload) =>
  adminRequest(`/api/admin/chemicals/${id}`, { method: "PUT", body: payload });

export const deleteChemical = (id) => adminRequest(`/api/admin/chemicals/${id}`, { method: "DELETE" });
