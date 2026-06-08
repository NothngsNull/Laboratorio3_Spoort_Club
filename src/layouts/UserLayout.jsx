import React from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

function UserLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar className="bg-corporate py-3 border-bottom border-3 border-warning" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand className="fw-bold">
            Sport<span className="text-corporate-accent">Club</span> <span className="badge bg-primary ms-2 fs-6">Usuario</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="user-nav" />
          <Navbar.Collapse id="user-nav" className="justify-content-end">
            <Nav className="align-items-center gap-3">
              <Nav.Link as={Link} to="/" className="text-white">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/user/dashboard" className="text-white">Mi Dashboard</Nav.Link>
              <Button onClick={handleLogout} className="btn-corporate-outline px-4">Cerrar Sesión</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="flex-grow-1 p-4">
        <Container><Outlet /></Container>
      </main>
    </div>
  );
}
export default UserLayout;