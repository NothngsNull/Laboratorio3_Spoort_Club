import React, { useState } from "react";
import { Card, Row, Col, Badge, Button, Form, Modal } from "react-bootstrap";
import { getUser, saveSession, updateProfile, changePassword } from "../services/authService";
import Swal from "sweetalert2";

const ROL_CONFIG = {
  admin: { color: "#2E1A47", bg: "#f0ebff", label: "Administrador", badge: "danger"  },
  coach: { color: "#145a32", bg: "#f0fff4", label: "Coach",         badge: "success" },
  user:  { color: "#1a3a6e", bg: "#f0f4ff", label: "Usuario",       badge: "primary" },
};

function PerfilPage() {
  const [user, setUser] = useState(() => getUser());
  const config = ROL_CONFIG[user?.role] ?? ROL_CONFIG.user;

  const [showEdit, setShowEdit] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
  });
  const [passForm, setPassForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  if (!user) {
    return (
      <div className="text-center py-5 text-muted">
        No se encontraron datos de sesión.
      </div>
    );
  }

  const inicial = (user.full_name || user.name || "?")[0].toUpperCase();
  const nombre  = user.full_name || user.name || "Usuario";
  const email   = (user.email || "").toLowerCase();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const resp = await updateProfile({
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
      });
      const updatedUser = resp.data || resp.user || resp;
      saveSession(user.token || localStorage.getItem("token"), updatedUser);
      setUser(updatedUser);
      setShowEdit(false);
      Swal.fire({ icon: "success", title: "Perfil actualizado", text: "Los cambios se guardaron correctamente.", timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message || "No se pudo actualizar el perfil." });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.new_password !== passForm.confirm_password) {
      Swal.fire({ icon: "error", title: "Error", text: "Las contraseñas no coinciden." });
      return;
    }
    try {
      await changePassword({
        current_password: passForm.current_password,
        new_password: passForm.new_password,
        confirm_password: passForm.confirm_password,
      });
      setShowPass(false);
      setPassForm({ current_password: "", new_password: "", confirm_password: "" });
      Swal.fire({ icon: "success", title: "Contraseña actualizada", text: "Tu contraseña fue cambiada correctamente.", timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message || "No se pudo cambiar la contraseña." });
    }
  };

  return (
    <div>
      <div
        className="rounded-4 p-4 mb-4 d-flex align-items-center gap-4 flex-wrap"
        style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`, color: "#fff" }}
      >
        <span
          className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-white shadow"
          style={{ width: 72, height: 72, background: "rgba(255,255,255,0.15)", fontSize: 30, border: "3px solid #F2B705" }}
        >
          {inicial}
        </span>
        <div>
          <h2 className="fw-bold mb-1">{nombre}</h2>
          <p className="mb-1 opacity-75" style={{ fontSize: "14px" }}>{email}</p>
          <Badge bg={config.badge}>{config.label}</Badge>
        </div>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: config.color }}>👤 Datos de la Cuenta</h5>
                <Button size="sm" onClick={() => { setForm({ full_name: user.full_name || "", email: user.email || "" }); setShowEdit(true); }}
                  style={{ background: "#F2B705", border: "none", color: "#2E1A47", fontWeight: 700, fontSize: "12px" }}>
                  ✏️ Editar
                </Button>
              </div>
              {[
                { label: "Nombre completo", valor: nombre },
                { label: "Correo electrónico", valor: email || "—" },
                { label: "Rol", valor: config.label },
                { label: "ID de usuario", valor: user.id ?? user._id ?? "—" },
              ].map(({ label, valor }) => (
                <div key={label}
                  className="d-flex justify-content-between align-items-center py-2"
                  style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <span className="text-muted" style={{ fontSize: "13px" }}>{label}</span>
                  <span className="fw-semibold" style={{ fontSize: "13px", color: config.color }}>{valor}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: config.color }}>🔒 Seguridad</h5>
                <Button size="sm" onClick={() => { setPassForm({ current_password: "", new_password: "", confirm_password: "" }); setShowPass(true); }}
                  style={{ background: "#F2B705", border: "none", color: "#2E1A47", fontWeight: 700, fontSize: "12px" }}>
                  🔑 Cambiar contraseña
                </Button>
              </div>
              <div className="p-3 rounded-3 mb-3 d-flex align-items-center gap-3" style={{ background: config.bg }}>
                <span style={{ fontSize: "2rem" }}>✅</span>
                <div>
                  <p className="fw-bold mb-0" style={{ fontSize: "14px", color: config.color }}>Sesión activa</p>
                  <p className="text-muted mb-0" style={{ fontSize: "12px" }}>Tu sesión está guardada en este dispositivo</p>
                </div>
              </div>
              <div className="p-3 rounded-3 d-flex align-items-center gap-3" style={{ background: "#fff8e1" }}>
                <span style={{ fontSize: "2rem" }}>🛡️</span>
                <div>
                  <p className="fw-bold mb-0" style={{ fontSize: "14px", color: "#d9a404" }}>Acceso por rol: {config.label}</p>
                  <p className="text-muted mb-0" style={{ fontSize: "12px" }}>Tus permisos están definidos según tu rol en el sistema</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ── Modal Editar Perfil ─────────────────────────────────────────── */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton style={{ background: "linear-gradient(90deg, #2E1A47, #4a2d6e)", borderBottom: "3px solid #F2B705" }}>
          <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>✏️ Editar Perfil</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveProfile}>
          <Modal.Body style={{ background: "#fafafa" }}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>Nombre completo</Form.Label>
              <Form.Control type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required style={{ fontSize: "14px" }} />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>Correo electrónico</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                required style={{ fontSize: "14px" }} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ background: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
            <Button variant="secondary" onClick={() => setShowEdit(false)} style={{ fontSize: "14px" }}>Cancelar</Button>
            <Button type="submit" style={{ background: "#F2B705", border: "none", color: "#2E1A47", fontWeight: 700, fontSize: "14px" }}>Guardar Cambios</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ── Modal Cambiar Contraseña ────────────────────────────────────── */}
      <Modal show={showPass} onHide={() => setShowPass(false)} centered>
        <Modal.Header closeButton style={{ background: "linear-gradient(90deg, #2E1A47, #4a2d6e)", borderBottom: "3px solid #F2B705" }}>
          <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>🔑 Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleChangePassword}>
          <Modal.Body style={{ background: "#fafafa" }}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>Contraseña actual</Form.Label>
              <Form.Control type="password" value={passForm.current_password}
                onChange={(e) => setPassForm({ ...passForm, current_password: e.target.value })}
                required style={{ fontSize: "14px" }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>Nueva contraseña</Form.Label>
              <Form.Control type="password" value={passForm.new_password}
                onChange={(e) => setPassForm({ ...passForm, new_password: e.target.value })}
                required minLength={8} style={{ fontSize: "14px" }} />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>Confirmar nueva contraseña</Form.Label>
              <Form.Control type="password" value={passForm.confirm_password}
                onChange={(e) => setPassForm({ ...passForm, confirm_password: e.target.value })}
                required style={{ fontSize: "14px" }} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ background: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
            <Button variant="secondary" onClick={() => setShowPass(false)} style={{ fontSize: "14px" }}>Cancelar</Button>
            <Button type="submit" style={{ background: "#F2B705", border: "none", color: "#2E1A47", fontWeight: 700, fontSize: "14px" }}>Cambiar Contraseña</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default PerfilPage;