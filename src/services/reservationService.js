const API_URL = "http://localhost:3000/api/reservations";
const MEMBER_URL = "http://localhost:3000/api/member";

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getMyReservations() {
  const response = await fetch(`${API_URL}/my-reservations`, {
    method: "GET",
    headers: getHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al obtener tus reservas.");
  }

  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

export async function createReservation(classScheduleId) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ class_schedule_id: classScheduleId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la reserva.");
  }

  return data;
}

export async function getAvailableClasses() {
  const response = await fetch(`${MEMBER_URL}/classes`, {
    method: "GET",
    headers: getHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al obtener las clases disponibles.");
  }

  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

export async function cancelReservation(reservationId) {
  const response = await fetch(`${API_URL}/${reservationId}/cancel`, {
    method: "PATCH",
    headers: getHeaders(),
  });

  if (!response.ok) {
    let msg = "Error al cancelar la reserva.";
    try {
      const data = await response.json();
      if (data.message) msg = data.message;
    } catch (_) { /* sin cuerpo JSON */ }
    throw new Error(msg);
  }

  return true;
}