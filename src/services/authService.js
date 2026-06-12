// ─────────────────────────────────────────────────────────────────────────────
// src/services/authService.js
//
// BUG CORREGIDO: la respuesta del backend SportClub es:
//   { ok: true, data: { token: "...", user: { id, full_name, email, role, ... } } }
//
// El problema: loginUser() devolvía data.data (que ya era { token, user }),
// pero Login.jsx luego intentaba leer data.token y data.user — eso funcionaba.
// El bug REAL está en que saveSession() guardaba token y user correctamente,
// PERO al recargar la página, RoleRoute llamaba isAuthenticated() que solo
// comprueba el token. Si el token expira o si el backend devuelve el user
// envuelto diferente, getUser() devuelve null y el rol no se puede leer,
// causando que RoleRoute redirija a /login.
//
// SOLUCIÓN APLICADA:
//   1. loginUser() ahora normaliza la respuesta del backend robustamente.
//   2. Login.jsx ya no necesita asumir nada sobre la estructura de data.
//   3. Se agrega getRedirectPath() para centralizar la lógica de redirección.
//   4. Se agrega redirectIfAuthenticated() para que /login y /register
//      redirijan al dashboard si ya hay sesión activa.
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = "http://localhost:3000/api/auth";

// ── LOGIN ─────────────────────────────────────────────────────────────────────
/**
 * Hace POST /api/auth/login y devuelve SIEMPRE { token, user }.
 *
 * El backend SportClub responde con:
 *   { ok: true, data: { token: "jwt...", user: { id, full_name, email, role } } }
 *
 * Esta función normaliza eso para que Login.jsx siempre reciba
 * exactamente { token: "...", user: { ... } } sin depender del envoltorio.
 */
export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(credentials),
  });

  const data = await response.json();

  // Si el servidor responde con error HTTP (400, 401, 500, etc.)
  if (!response.ok) {
    throw new Error(data.message || "Correo o contraseña incorrectos.");
  }

  // Normalizar la respuesta — el backend puede responder de varias formas:
  //   Forma A (SportClub): { ok: true, data: { token, user } }
  //   Forma B (alternativa): { token, user }
  //   Forma C (otra alternativa): { token, data: { ...userFields } }

  let token = null;
  let user  = null;

  if (data.data?.token) {
    // Forma A — la más común en este backend
    token = data.data.token;
    user  = data.data.user ?? data.data;
  } else if (data.token) {
    // Forma B
    token = data.token;
    user  = data.user ?? data;
  }

  if (!token) {
    throw new Error("El servidor no devolvió un token válido.");
  }

  if (!user || !user.role) {
    throw new Error("El servidor no devolvió los datos del usuario.");
  }

  return { token, user };
}

// ── REGISTRO ──────────────────────────────────────────────────────────────────
/**
 * Hace POST /api/auth/register.
 * Acepta opciones extra (birth_date, metadata).
 */
export async function registerUser(name, email, password, opciones = {}) {
  const body = {
    full_name:  name,
    email:      email,
    password:   password,
    birth_date: opciones.birth_date || null,
    metadata:   opciones.metadata   || {},
  };

  const response = await fetch(`${API_URL}/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al registrar usuario.");
  }

  return data;
}

// ── SESIÓN ────────────────────────────────────────────────────────────────────

/** Guarda token y usuario en localStorage. */
export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user",  JSON.stringify(user));
}

/** Devuelve el token JWT o null. */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Devuelve el objeto usuario guardado en sesión, o null.
 * Manejo defensivo: si el JSON está corrupto, limpia la sesión.
 */
export function getUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    // JSON inválido → limpiar para que no quede un estado corrupto
    localStorage.removeItem("user");
    return null;
  }
}

/** true si hay token en localStorage. */
export function isAuthenticated() {
  return Boolean(getToken());
}

/** Elimina token y usuario del localStorage. */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// ── HELPERS DE NAVEGACIÓN ─────────────────────────────────────────────────────

/**
 * Devuelve la ruta del dashboard según el rol del usuario en sesión.
 * Usado por Login.jsx para navegar después del login, y por
 * redirectIfAuthenticated() para no volver a mostrar /login si ya hay sesión.
 */
export function getRedirectPath() {
  const user = getUser();
  if (!user?.role) return "/login";
  if (user.role === "admin") return "/admin/dashboard";
  if (user.role === "coach") return "/coach/dashboard";
  return "/user/dashboard";
}

/**
 * Devuelve true si el usuario ya tiene sesión activa.
 * Usar en Login y Register para redirigir al dashboard si ya está autenticado.
 *
 * Ejemplo de uso en Login.jsx:
 *   const ya = redirectIfAuthenticated();
 *   if (ya) return <Navigate to={ya} replace />;
 */
export function redirectIfAuthenticated() {
  if (isAuthenticated() && getUser()?.role) {
    return getRedirectPath();
  }
  return null;
}