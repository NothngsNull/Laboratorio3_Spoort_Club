import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/authService';

function NavbarComponent() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar className="bg-corporate" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-white">
          Sport<span className="text-corporate-accent">Club</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            
            {user ? (
              <>
                <span className="text-white">Hola, {user.name}</span>
                <Button variant="outline-light" onClick={handleLogout} className="px-4">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-light" className="px-4">
                  Ingresar
                </Button>
                <Button as={Link} to="/register" className="btn-corporate-solid px-4">
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;