import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

// Estado inicial limpio del formulario
const INITIAL_FORM = {
  full_name: "",
  email: "",
  role: "user",
  password: "",
};

function UserFormModal({ show, handleClose, handleSave, selectedUser }) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  // ── Sincroniza el formulario cuando se abre el modal ──────────────────────
  // Si viene un usuario seleccionado → modo edición (sin contraseña obligatoria)
  // Si no → modo creación con formulario vacío
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        full_name: selectedUser.full_name || "",
        email:     selectedUser.email     || "",
        role:      selectedUser.role      || "user",
        password:  "", // nunca pre-rellenamos la contraseña por seguridad
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [selectedUser, show]);

  // ── Maneja cambios en inputs y selects ────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Submit: delega toda la lógica al componente padre (UsersPage) ─────────
  const onSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Modal show={show} onHide={handleClose} centered>

      {/* Cabecera con color corporativo */}
      <Modal.Header
        closeButton
        style={{ background: "#2E1A47", borderBottom: "3px solid #F2B705" }}
      >
        <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
          {selectedUser ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit} noValidate>
        <Modal.Body style={{ background: "#fafafa" }}>

          {/* Nombre completo */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Nombre Completo
            </Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              required
              style={{ fontSize: "14px" }}
            />
          </Form.Group>

          {/* Correo */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Correo Electrónico
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="usuario@correo.com"
              required
              style={{ fontSize: "14px" }}
            />
          </Form.Group>

          {/* Contraseña — solo visible al CREAR (no al editar) */}
          {!selectedUser && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
                Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                style={{ fontSize: "14px" }}
              />
              <Form.Text className="text-muted" style={{ fontSize: "12px" }}>
                La contraseña solo se configura al crear el usuario.
              </Form.Text>
            </Form.Group>
          )}

          {/* Rol */}
          <Form.Group className="mb-1">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Rol del Usuario
            </Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ fontSize: "14px" }}
            >
              <option value="user">Usuario</option>
              <option value="coach">Coach</option>
              <option value="admin">Administrador</option>
            </Form.Select>
          </Form.Group>

        </Modal.Body>

        {/* Footer con botones corporativos */}
        <Modal.Footer style={{ background: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ fontSize: "14px" }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            style={{
              background: "#F2B705",
              border: "none",
              color: "#2E1A47",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            {selectedUser ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </Modal.Footer>
      </Form>

    </Modal>
  );
}

export default UserFormModal;
