// src/services/sportService.js

const API_URL = "http://localhost:3000/api/sports";

/** Lee el token guardado por authService.js */
function getToken() {
  return localStorage.getItem("token");
}

/** Cabeceras estándar con Bearer token */
function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ── GET /api/sports ───────────────────────────────────────────────────────────
/**
 * Devuelve el array de deportes.
 */
export async function getSports() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener la lista de deportes.");
  }

  const json = await response.json();

  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

// ── POST /api/sports ──────────────────────────────────────────────────────────
/**
 * Crea un nuevo deporte.
 * @param {{ name: string, objective: string, duration: number, status: boolean }} sportData
 */
export async function createSport(sportData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(sportData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear el deporte.");
  }

  return data;
}

// ── PUT /api/sports/:id ───────────────────────────────────────────────────────
/**
 * Actualiza un deporte existente.
 * @param {number|string} id
 * @param {{ name: string, objective: string, duration: number, status: boolean }} sportData
 */
export async function updateSport(id, sportData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(sportData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar el deporte.");
  }

  return data;
}

// ── DELETE /api/sports/:id ────────────────────────────────────────────────────
/**
 * Elimina un deporte por id.
 * @param {number|string} id
 */
export async function deleteSport(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    let msg = "Error al eliminar el deporte.";
    try {
      const data = await response.json();
      if (data.message) msg = data.message;
    } catch (_) { /* sin cuerpo JSON */ }
    throw new Error(msg);
  }

  return true;
}

// ── PATCH /api/sports/:id/status ─────────────────────────────────────────────
/**
 * Cambia solo el estado (activo/inactivo) de un deporte.
 * @param {number|string} id
 * @param {boolean} status
 */
export async function toggleSportStatus(id, status) {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al cambiar el estado del deporte.");
  }

  return data;
}
