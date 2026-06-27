const API_URL = "http://localhost:3000/api/users";

/** Lee el token que authService.js guardó en localStorage */
function getToken() {
  return localStorage.getItem("token");
}

/** Cabeceras estándar: Content-Type + Bearer token */
function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ── GET /api/users ────────────────────────────────────────────────────────────
/**
 * Devuelve el array de usuarios.
 * El backend puede responder como:
 *   { data: [...] }   ← formato más común en este proyecto
 *   [...]             ← array directo
 * Esta función siempre devuelve un array limpio.
 */
export async function getUsers() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener la lista de usuarios.");
  }

  const json = await response.json();

  // Normaliza la respuesta: puede venir en json.data o directamente como array
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.users)) return json.users;
  return [];
}

export async function getCoaches() {
  const users = await getUsers();
  return users.filter((u) => u.role === "coach");
}

// ── POST /api/users ───────────────────────────────────────────────────────────
/**
 * Crea un nuevo usuario.
 * @param {Object} userData  { full_name, email, password, role }
 */
export async function createUser(userData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear el usuario.");
  }

  return data;
}

// ── PUT /api/users/:id ────────────────────────────────────────────────────────
/**
 * Actualiza un usuario existente.
 * Acepta id numérico o string (compatible con _id de Mongo y id de SQL).
 * @param {string|number} id
 * @param {Object} userData  { full_name, email, role, password? }
 */
export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar el usuario.");
  }

  return data;
}

// ── DELETE /api/users/:id ─────────────────────────────────────────────────────
/**
 * Elimina un usuario por id.
 * @param {string|number} id
 */
export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    // Intenta leer el mensaje de error del backend si existe
    let msg = "Error al eliminar el usuario.";
    try {
      const data = await response.json();
      if (data.message) msg = data.message;
    } catch (_) { /* sin cuerpo JSON — usar msg por defecto */ }
    throw new Error(msg);
  }

  return true;
}