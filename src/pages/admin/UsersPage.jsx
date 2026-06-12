// ─────────────────────────────────────────────────────────────────────────────
// src/pages/admin/UsersPage.jsx
//
// Página de administración de usuarios.
// Responsabilidades:
//   1. Cargar y mostrar usuarios desde el backend (GET /api/users)
//   2. Abrir modal para crear o editar (POST / PUT)
//   3. Eliminar con confirmación SweetAlert2 (DELETE)
//   4. Actualizar la tabla en memoria sin recargar el navegador
//
// Nota sobre IDs:
//   El backend puede devolver el id como "id" (SQL) o "_id" (Mongo).
//   Usamos el helper getUserId(user) para normalizar ambos casos.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import UserFormModal from "../../components/users/UserFormModal";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../services/userService";

// ── Helper: normaliza el id sin importar si viene como "id" o "_id" ──────────
function getUserId(user) {
  return user.id ?? user._id;
}

// ── Helper: badge de color según rol ─────────────────────────────────────────
function RolBadge({ role }) {
  const mapa = {
    admin: { bg: "danger",  label: "Administrador" },
    coach: { bg: "success", label: "Coach"         },
    user:  { bg: "primary", label: "Usuario"       },
  };
  const conf = mapa[role] ?? { bg: "secondary", label: role };
  return <Badge bg={conf.bg}>{conf.label}</Badge>;
}

// ── Componente principal ──────────────────────────────────────────────────────
function UsersPage() {
  const [users,         setUsers]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showModal,     setShowModal]     = useState(false);
  const [selectedUser,  setSelectedUser]  = useState(null);
  const [searchTerm,    setSearchTerm]    = useState("");

  // ── Carga usuarios desde el backend ───────────────────────────────────────
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();   // userService ya normaliza el array
      setUsers(data);
    } catch (error) {
      Swal.fire({
        title:             "Error de conexión",
        text:              error.message,
        icon:              "error",
        confirmButtonColor: "#2E1A47",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ── Abrir modal en modo CREAR ──────────────────────────────────────────────
  const openCreateModal = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  // ── Abrir modal en modo EDITAR ─────────────────────────────────────────────
  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // ── Cerrar modal ──────────────────────────────────────────────────────────
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // ── Guardar (crear o editar) ───────────────────────────────────────────────
  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        // EDITAR: no enviamos password si está vacío
        const payload = { ...formData };
        if (!payload.password) delete payload.password;

        await updateUser(getUserId(selectedUser), payload);

        Swal.fire({
          title:             "¡Actualizado!",
          text:              `${formData.full_name} fue actualizado correctamente.`,
          icon:              "success",
          confirmButtonColor: "#2E1A47",
          timer:             2000,
          showConfirmButton: false,
        });
      } else {
        // CREAR
        await createUser(formData);

        Swal.fire({
          title:             "¡Creado!",
          text:              `${formData.full_name} fue creado correctamente.`,
          icon:              "success",
          confirmButtonColor: "#2E1A47",
          timer:             2000,
          showConfirmButton: false,
        });
      }

      closeModal();
      loadUsers(); // refresca la tabla desde el backend
    } catch (error) {
      Swal.fire({
        title:             "Error al guardar",
        text:              error.message,
        icon:              "error",
        confirmButtonColor: "#2E1A47",
      });
    }
  };

  // ── Eliminar usuario ──────────────────────────────────────────────────────
  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title:              "¿Eliminar usuario?",
      html:               `Se eliminará a <strong>${user.full_name}</strong>.<br>Esta acción no se puede deshacer.`,
      icon:               "warning",
      showCancelButton:   true,
      confirmButtonText:  "Sí, eliminar",
      cancelButtonText:   "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor:  "#2E1A47",
      reverseButtons:     true, // "Cancelar" queda a la izquierda (más seguro)
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(getUserId(user));

        Swal.fire({
          title:             "Eliminado",
          text:              `${user.full_name} fue eliminado del sistema.`,
          icon:              "success",
          confirmButtonColor: "#2E1A47",
          timer:             2000,
          showConfirmButton: false,
        });

        loadUsers();
      } catch (error) {
        Swal.fire({
          title:             "Error al eliminar",
          text:              error.message,
          icon:              "error",
          confirmButtonColor: "#2E1A47",
        });
      }
    }
  };

  // ── Filtro de búsqueda (solo en cliente, sin nueva petición) ──────────────
  const usuariosFiltrados = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.full_name || "").toLowerCase().includes(term) ||
      (u.email     || "").toLowerCase().includes(term) ||
      (u.role      || "").toLowerCase().includes(term)
    );
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Cabecera de sección ─────────────────────────────────────── */}
      <div
        className="rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3"
        style={{
          background: "linear-gradient(135deg, #2E1A47, #4a2d6e)",
          color: "#fff",
        }}
      >
        <div>
          <h2 className="fw-bold mb-1">Gestión de Usuarios</h2>
          <p className="mb-0 opacity-75">
            {loading
              ? "Cargando..."
              : `${users.length} usuario${users.length !== 1 ? "s" : ""} registrado${users.length !== 1 ? "s" : ""} en el sistema`}
          </p>
        </div>
        <span style={{ fontSize: "3rem" }}>👥</span>
      </div>

      {/* ── Card principal ──────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">

        {/* Barra de herramientas */}
        <Card.Header
          className="d-flex flex-wrap gap-3 align-items-center justify-content-between py-3"
          style={{ background: "#fff", borderBottom: "2px solid #f0ebff" }}
        >
          {/* Buscador */}
          <input
            type="search"
            className="form-control"
            placeholder="🔍 Buscar por nombre, correo o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 320, fontSize: "14px" }}
          />

          {/* Botón nuevo usuario */}
          <Button
            onClick={openCreateModal}
            style={{
              background: "#F2B705",
              border: "none",
              color: "#2E1A47",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            + Nuevo Usuario
          </Button>
        </Card.Header>

        <Card.Body className="p-0">

          {/* Estado: cargando */}
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#2E1A47" }} />
              <p className="text-muted mt-3 mb-0" style={{ fontSize: "14px" }}>
                Cargando usuarios desde el servidor...
              </p>
            </div>
          )}

          {/* Estado: sin resultados de búsqueda */}
          {!loading && usuariosFiltrados.length === 0 && (
            <div className="text-center py-5 text-muted" style={{ fontSize: "14px" }}>
              {searchTerm
                ? `No se encontraron usuarios para "${searchTerm}".`
                : "No hay usuarios registrados."}
            </div>
          )}

          {/* Tabla */}
          {!loading && usuariosFiltrados.length > 0 && (
            <Table responsive hover className="align-middle mb-0" style={{ fontSize: "14px" }}>
              <thead style={{ background: "#f8f5ff" }}>
                <tr>
                  <th style={{ width: 50, color: "#2E1A47" }}>#</th>
                  <th style={{ color: "#2E1A47" }}>Avatar</th>
                  <th style={{ color: "#2E1A47" }}>Nombre Completo</th>
                  <th style={{ color: "#2E1A47" }}>Correo</th>
                  <th style={{ color: "#2E1A47" }}>Rol</th>
                  <th style={{ color: "#2E1A47", textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((user, index) => (
                  <tr key={getUserId(user) ?? index}>
                    <td className="text-muted" style={{ fontSize: "12px" }}>
                      {getUserId(user) ?? index + 1}
                    </td>

                    {/* Avatar con inicial */}
                    <td>
                      <span
                        className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-white"
                        style={{
                          width: 36,
                          height: 36,
                          background: "#2E1A47",
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        {(user.full_name || "?")[0].toUpperCase()}
                      </span>
                    </td>

                    <td className="fw-semibold">{user.full_name || "—"}</td>
                    <td className="text-muted">{(user.email || "—").toLowerCase()}</td>
                    <td><RolBadge role={user.role} /></td>

                    {/* Acciones */}
                    <td style={{ textAlign: "center" }}>
                      <Button
                        size="sm"
                        className="me-2"
                        onClick={() => openEditModal(user)}
                        style={{
                          background: "#F2B705",
                          border: "none",
                          color: "#2E1A47",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      >
                        ✏️ Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(user)}
                        style={{ fontSize: "12px", fontWeight: 600 }}
                      >
                        🗑️ Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>

        {/* Pie de tabla con conteo */}
        {!loading && users.length > 0 && (
          <Card.Footer
            className="text-muted py-2 px-4"
            style={{ background: "#fafafa", fontSize: "12px" }}
          >
            Mostrando {usuariosFiltrados.length} de {users.length} usuarios
            {searchTerm && ` — filtrado por "${searchTerm}"`}
          </Card.Footer>
        )}
      </Card>

      {/* ── Modal (fuera de la Card para no anidar contextos) ─────── */}
      <UserFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />
    </>
  );
}

export default UsersPage;
