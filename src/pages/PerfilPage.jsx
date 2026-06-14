import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { getUser } from "../services/authService";

// Colores y etiqueta según el rol
const ROL_CONFIG = {
  admin: { color: "#2E1A47", bg: "#f0ebff", label: "Administrador", badge: "danger"  },
  coach: { color: "#145a32", bg: "#f0fff4", label: "Coach",         badge: "success" },
  user:  { color: "#1a3a6e", bg: "#f0f4ff", label: "Usuario",       badge: "primary" },
};

function PerfilPage() {
  const user   = getUser();
  const config = ROL_CONFIG[user?.role] ?? ROL_CONFIG.user;

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

  return (
    <div>
      {/* ── Banner de perfil ─────────────────────────────────────────── */}
      <div
        className="rounded-4 p-4 mb-4 d-flex align-items-center gap-4 flex-wrap"
        style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`, color: "#fff" }}
      >
        {/* Avatar grande */}
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

      {/* ── Tarjetas de información ───────────────────────────────────── */}
      <Row className="g-4">

        {/* Datos de la cuenta */}
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4" style={{ color: config.color }}>
                👤 Datos de la Cuenta
              </h5>

              {[
                { label: "Nombre completo", valor: nombre },
                { label: "Correo electrónico", valor: email || "—" },
                { label: "Rol", valor: config.label },
                { label: "ID de usuario", valor: user.id ?? user._id ?? "—" },
              ].map(({ label, valor }) => (
                <div
                  key={label}
                  className="d-flex justify-content-between align-items-center py-2"
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <span className="text-muted" style={{ fontSize: "13px" }}>{label}</span>
                  <span className="fw-semibold" style={{ fontSize: "13px", color: config.color }}>{valor}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Estado de la sesión */}
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4" style={{ color: config.color }}>
                🔒 Estado de Sesión
              </h5>

              <div
                className="p-3 rounded-3 mb-3 d-flex align-items-center gap-3"
                style={{ background: config.bg }}
              >
                <span style={{ fontSize: "2rem" }}>✅</span>
                <div>
                  <p className="fw-bold mb-0" style={{ fontSize: "14px", color: config.color }}>
                    Sesión activa
                  </p>
                  <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                    Tu sesión está guardada en este dispositivo
                  </p>
                </div>
              </div>

              <div
                className="p-3 rounded-3 d-flex align-items-center gap-3"
                style={{ background: "#fff8e1" }}
              >
                <span style={{ fontSize: "2rem" }}>🛡️</span>
                <div>
                  <p className="fw-bold mb-0" style={{ fontSize: "14px", color: "#d9a404" }}>
                    Acceso por rol: {config.label}
                  </p>
                  <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                    Tus permisos están definidos según tu rol en el sistema
                  </p>
                </div>
              </div>

              <p className="text-muted mt-3 mb-0" style={{ fontSize: "12px" }}>
                Para cerrar sesión usa el botón en la barra de navegación.
              </p>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  );
}

export default PerfilPage;
