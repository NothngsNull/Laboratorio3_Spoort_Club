import React from 'react';
import { Link } from "react-router-dom";
import { Alert, Button, Container } from "react-bootstrap";

function Unauthorized() {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Container className="mt-5" style={{ maxWidth: '600px' }}>
        <Alert variant="danger" className="shadow-sm border-0 rounded-4 p-5 text-center">
          <Alert.Heading className="fw-bold display-6 mb-3">Acceso no autorizado</Alert.Heading>
          <p className="fs-5 text-muted mb-4">No tienes permisos para acceder a esta sección del sistema SportClub.</p>
          <Link to="/login">
            <Button variant="danger" size="lg" className="px-5 rounded-pill fw-bold shadow-sm">
              Volver al Login
            </Button>
          </Link>
        </Alert>
      </Container>
    </div>
  );
}

export default Unauthorized;