const SCHEDULES_URL = "http://localhost:3000/api/class-schedules";
const SPORT_ROOMS_URL = "http://localhost:3000/api/sport-rooms";
const COACH_URL = "http://localhost:3000/api/coach";

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ── Class Schedules (horarios) ────────────────────────────────────────────────

export async function getSchedules() {
  const response = await fetch(SCHEDULES_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al obtener los horarios.");
  }

  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

export async function createSchedule(scheduleData) {
  const response = await fetch(SCHEDULES_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(scheduleData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear el horario.");
  }

  return data;
}

export async function updateSchedule(id, scheduleData) {
  const response = await fetch(`${SCHEDULES_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(scheduleData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar el horario.");
  }

  return data;
}

export async function deleteSchedule(id) {
  const response = await fetch(`${SCHEDULES_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    let msg = "Error al eliminar el horario.";
    try {
      const data = await response.json();
      if (data.message) msg = data.message;
    } catch (_) { /* sin cuerpo JSON */ }
    throw new Error(msg);
  }

  return true;
}

// ── Sport Rooms (asignaciones deporte+sala+coach) ──────────────────────────────

export async function getSportRooms() {
  const response = await fetch(SPORT_ROOMS_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al obtener las asignaciones.");
  }

  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

export async function createSportRoom(data) {
  const response = await fetch(SPORT_ROOMS_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const respData = await response.json();

  if (!response.ok) {
    throw new Error(respData.message || "Error al crear la asignación.");
  }

  return respData;
}

export async function updateSportRoom(id, data) {
  const response = await fetch(`${SPORT_ROOMS_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const respData = await response.json();

  if (!response.ok) {
    throw new Error(respData.message || "Error al actualizar la asignación.");
  }

  return respData;
}

export async function deleteSportRoom(id) {
  const response = await fetch(`${SPORT_ROOMS_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    let msg = "Error al eliminar la asignación.";
    try {
      const data = await response.json();
      if (data.message) msg = data.message;
    } catch (_) { /* sin cuerpo JSON */ }
    throw new Error(msg);
  }

  return true;
}

// ── Coach Dashboard ───────────────────────────────────────────────────────────

export async function getCoachMyClasses() {
  const response = await fetch(`${COACH_URL}/my-classes`, {
    method: "GET",
    headers: getHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al obtener mis clases.");
  }

  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

export async function getCoachMySchedules() {
  const response = await fetch(`${COACH_URL}/my-schedules`, {
    method: "GET",
    headers: getHeaders(),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Error al obtener mi horario.");
  }

  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  return [];
}