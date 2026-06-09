const API_URL = "http://localhost:3000/api/auth";

// --- LOGIN ---
export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok && response.status !== 400 && response.status !== 401) {
    throw new Error(`Error del servidor: ${response.status}`);
  }
  if (!response.ok || (!data.ok && !data.token)) {
    throw new Error(data.message || "Correo o contraseña incorrectos.");
  }

  // La API puede devolver la info dentro de data.data o directamente en data
  return data.data ? data.data : data;
}

// --- REGISTRO ---
// Acepta opciones extra (birth_date, metadata) para enviarlos a la API
export async function registerUser(name, email, password, opciones = {}) {
  const body = {
    full_name:  name,
    email:      email,
    password:   password,
    birth_date: opciones.birth_date  || null,
    metadata:   opciones.metadata    || {}
  };

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok && response.status !== 201) {
    throw new Error(data.message || "Error al registrar usuario.");
  }

  return data;
}

// --- SESIÓN ---
export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}