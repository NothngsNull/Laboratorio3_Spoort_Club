import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button, NavDropdown } from "react-bootstrap";
import { logout, getUser } from "../services/authService";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user     = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Resalta el link cuyo path coincide con la ruta actual
  const linkActivo = (path) =>
    location.pathname === path
      ? { borderBottom: "3px solid #F2B705", color: "#F2B705", paddingBottom: "2px" }
      : {};

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "#f4f0ff" }}>

      {/* ── Navbar MORADO (color Admin según anexo) ─────────────────── */}
      <Navbar
        style={{ background: "linear-gradient(90deg, #2E1A47, #4a2d6e)" }}
        variant="dark"
        expand="lg"
        className="py-3 shadow-sm"
      >
        <Container>

          {/* Brand + badge de rol */}
          <Navbar.Brand as={Link} to="/admin/dashboard" className="fw-bold fs-5 text-white">
            Sport<span style={{ color: "#F2B705" }}>Club</span>
            <span
              className="ms-2 badge"
              style={{ background: "#dc3545", fontSize: "12px", fontWeight: 700 }}
            >
              Administrador
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="admin-nav" />

          <Navbar.Collapse id="admin-nav" className="justify-content-end">
            <Nav className="align-items-center gap-2">

              <Nav.Link as={Link} to="/admin/dashboard" className="text-white fw-semibold" style={linkActivo("/admin/dashboard")}>
                Panel Central
              </Nav.Link>

              <Nav.Link as={Link} to="/admin/users" className="text-white fw-semibold" style={linkActivo("/admin/users")}>
                Usuarios
              </Nav.Link>

              {/* ── Mi Perfil (OBLIGATORIO según anexo) ─────────────── */}
              <Nav.Link as={Link} to="/admin/perfil" className="text-white fw-semibold" style={linkActivo("/admin/perfil")}>
                Mi Perfil
              </Nav.Link>

              {/* Saludo al usuario */}
              {user && (
                <span className="text-white opacity-75" style={{ fontSize: "13px" }}>
                  Hola, <strong>{(user.full_name || user.name || "Admin").split(" ")[0]}</strong>
                </span>
              )}

              {/* Cerrar sesión */}
              <Button
                onClick={handleLogout}
                size="sm"
                style={{
                  background: "transparent",
                  border: "2px solid #F2B705",
                  color: "#F2B705",
                  fontWeight: 700,
                  fontSize: "13px",
                  borderRadius: "8px",
                  padding: "5px 16px",
                  transition: "all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F2B705"; e.currentTarget.style.color = "#2E1A47"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#F2B705"; }}
              >
                Cerrar Sesión
              </Button>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ── Contenido ──────────────────────────────────────────────────── */}
      <main className="flex-grow-1 p-4">
        <Container>
          <Outlet />
        </Container>
      </main>

      {/* ── Footer simple ───────────────────────────────────────────────── */}
      <footer
        className="text-center py-2"
        style={{ background: "#2E1A47", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}
      >
        SportClub © 2026 — Panel Administrador
      </footer>

    </div>
  );
}

export default AdminLayout;