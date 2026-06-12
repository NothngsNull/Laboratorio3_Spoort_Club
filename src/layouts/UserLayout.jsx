// src/layouts/UserLayout.jsx
// ─────────────────────────────────────────────────────────────────────────────
// CAMBIOS según el Anexo Evaluación N°3:
//   + Link "Mi Perfil" obligatorio en el header
//   + Color principal diferenciado: AZUL (#0d6efd / #1a3a6e)
//   + Badge "Usuario" en el header
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { logout, getUser } from "../services/authService";

function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user     = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkActivo = (path) =>
    location.pathname === path
      ? { borderBottom: "3px solid #F2B705", color: "#F2B705", paddingBottom: "2px" }
      : {};

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "#f0f4ff" }}>

      {/* ── Navbar AZUL (color Usuario según anexo) ──────────────────── */}
      <Navbar
        style={{ background: "linear-gradient(90deg, #1a3a6e, #0d6efd)" }}
        variant="dark"
        expand="lg"
        className="py-3 shadow-sm"
      >
        <Container>

          <Navbar.Brand as={Link} to="/user/dashboard" className="fw-bold fs-5 text-white">
            Sport<span style={{ color: "#F2B705" }}>Club</span>
            <span
              className="ms-2 badge"
              style={{ background: "#0d6efd", border: "2px solid #F2B705", fontSize: "12px", fontWeight: 700 }}
            >
              Usuario
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="user-nav" />

          <Navbar.Collapse id="user-nav" className="justify-content-end">
            <Nav className="align-items-center gap-2">

              <Nav.Link as={Link} to="/user/dashboard" className="text-white fw-semibold" style={linkActivo("/user/dashboard")}>
                Mi Dashboard
              </Nav.Link>

              {/* ── Mi Perfil (OBLIGATORIO según anexo) ─────────────── */}
              <Nav.Link as={Link} to="/user/perfil" className="text-white fw-semibold" style={linkActivo("/user/perfil")}>
                Mi Perfil
              </Nav.Link>

              {user && (
                <span className="text-white opacity-75" style={{ fontSize: "13px" }}>
                  Hola, <strong>{(user.full_name || user.name || "Deportista").split(" ")[0]}</strong>
                </span>
              )}

              <Button
                onClick={handleLogout}
                size="sm"
                style={{
                  background:   "transparent",
                  border:       "2px solid #F2B705",
                  color:        "#F2B705",
                  fontWeight:   700,
                  fontSize:     "13px",
                  borderRadius: "8px",
                  padding:      "5px 16px",
                  transition:   "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F2B705"; e.currentTarget.style.color = "#1a3a6e"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#F2B705"; }}
              >
                Cerrar Sesión
              </Button>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1 p-4">
        <Container>
          <Outlet />
        </Container>
      </main>

      <footer
        className="text-center py-2"
        style={{ background: "#1a3a6e", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}
      >
        SportClub © 2026 — Área de Socios
      </footer>

    </div>
  );
}

export default UserLayout;