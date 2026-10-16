// All communication with the Flask backend lives here.
// To point the app at a deployed backend, set VITE_API_BASE_URL in a .env file
// (see .env.example) or change the fallback below.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export class ApiError extends Error {
  constructor(message, kind = "network") {
    super(message);
    this.name = "ApiError";
    // kind: "network" | "http" | "invalid"
    this.kind = kind;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(
      "Could not reach the backend. Make sure the Flask server is running.",
      "network"
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    if (response.ok) {
      throw new ApiError("The backend returned an invalid response.", "invalid");
    }
  }

  if (!response.ok) {
    const detail =
      data && typeof data === "object" && (data.error || data.message);
    throw new ApiError(
      detail || `The backend responded with an error (HTTP ${response.status}).`,
      "http"
    );
  }

  return data;
}

/** GET /api/status */
export function getStatus() {
  return request("/api/status");
}

/** POST /api/search  { chemical_name } */
export async function searchChemical(chemicalName) {
  const data = await request("/api/search", {
    method: "POST",
    body: JSON.stringify({ chemical_name: chemicalName }),
  });

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new ApiError("The backend returned an invalid response.", "invalid");
  }
  if (data.matches !== undefined && !Array.isArray(data.matches)) {
    throw new ApiError("The backend returned an invalid response.", "invalid");
  }
  return data;
}
