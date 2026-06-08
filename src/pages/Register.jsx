import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const name = e.target.regName.value;
    const email = e.target.regEmail.value.toLowerCase();
    const password = e.target.regPassword.value;
    const confirmPassword = e.target.regConfirm.value;

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Intentamos registrar al usuario en nuestra "Base de Datos"
      registerUser(name, email, password);
      setSuccess('¡Registro exitoso! Redirigiendo al Login...');
      
      // Esperamos 2 segundos para que el usuario lea el mensaje antes de redirigir
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-corporate d-flex align-items-center min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden" style={{ borderTop: '5px solid #F2B705' }}>
              <Card.Header className="bg-white text-center py-4 border-0">
                <h2 className="fw-bold text-corporate mb-0">
                  Sport<span className="text-corporate-accent">Club</span>
                </h2>
              </Card.Header>
              <Card.Body className="p-4 bg-white">
                <h4 className="text-center mb-4 fw-bold text-dark">Crear Cuenta Nueva</h4>
                
                {error && <Alert variant="danger" className="fw-bold text-center">{error}</Alert>}
                {success && <Alert variant="success" className="fw-bold text-center">{success}</Alert>}

                <Form onSubmit={handleRegister}>
                  <Form.Group className="mb-3" controlId="regName">
                    <Form.Label className="fw-bold text-secondary">Nombre Completo</Form.Label>
                    <Form.Control type="text" placeholder="Ej. Juan Pérez" required className="py-2 bg-light border-0" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="regEmail">
                    <Form.Label className="fw-bold text-secondary">Correo electrónico</Form.Label>
                    <Form.Control type="email" placeholder="usuario@ejemplo.com" required className="py-2 bg-light border-0" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="regPassword">
                    <Form.Label className="fw-bold text-secondary">Contraseña Segura</Form.Label>
                    <Form.Control type="password" placeholder="Mínimo 8 caracteres, 1 mayúscula y 1 número" required className="py-2 bg-light border-0" />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="regConfirm">
                    <Form.Label className="fw-bold text-secondary">Confirmar Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Repite tu contraseña" required className="py-2 bg-light border-0" />
                  </Form.Group>

                  <div className="d-grid mt-4">
                    <Button type="submit" size="lg" className="btn-corporate-solid py-2">
                      Registrarme
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center py-3 bg-light border-0">
                <span className="text-muted small">¿Ya tienes cuenta? </span>
                <Link to="/login" className="text-decoration-none small fw-bold text-corporate">
                  Inicia sesión aquí
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;