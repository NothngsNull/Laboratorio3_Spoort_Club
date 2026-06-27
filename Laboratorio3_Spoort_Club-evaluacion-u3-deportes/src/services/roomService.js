const API_URL = "http://localhost:3000/api/rooms";

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getRooms() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json.message || "Error al obtener la lista de salas.");
  }

  const json = await response.json();

  // Backend: { ok: true, data: [...] }
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

export async function createRoom(roomData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(roomData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la sala.");
  }

  return data;
}

export async function updateRoom(id, roomData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(roomData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la sala.");
  }

  return data;
}

export async function deleteRoom(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    let msg = "Error al eliminar la sala.";
    try {
      const data = await response.json();
      if (data.message) msg = data.message;
    } catch (_) { /* sin cuerpo JSON */ }
    throw new Error(msg);
  }

  return true;
}