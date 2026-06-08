import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const email = e.target.loginEmail.value.toLowerCase();
    const password = e.target.loginPassword.value;

    try {
      // Validar contra nuestra base de datos simulada
      const loggedUser = loginUser(email, password);

      // Si todo es correcto, guardamos la sesión y el token
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('token', loggedUser.token);

      // Redirigir según el rol
      if (loggedUser.role === 'admin') navigate('/admin/dashboard');
      else if (loggedUser.role === 'coach') navigate('/coach/dashboard');
      else navigate('/user/dashboard');
      
    } catch (err) {
      setError(err.message); // Mostrará "Credenciales incorrectas"
    }
  };

  return (
    <div className="bg-corporate d-flex align-items-center min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden" style={{ borderTop: '5px solid #F2B705' }}>
              <Card.Header className="bg-white text-center py-4 border-0">
                <h2 className="fw-bold text-corporate mb-0">
                  Sport<span className="text-corporate-accent">Club</span>
                </h2>
              </Card.Header>
              <Card.Body className="p-4 bg-white">
                <h4 className="text-center mb-4 fw-bold text-dark">Iniciar Sesión</h4>
                
                {error && <Alert variant="danger" className="fw-bold text-center">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-4" controlId="loginEmail">
                    <Form.Label className="fw-bold text-secondary">Correo electrónico</Form.Label>
                    <Form.Control type="email" placeholder="usuario@empresa.cl" required className="py-2 bg-light border-0" />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="loginPassword">
                    <Form.Label className="fw-bold text-secondary">Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="••••••••" required className="py-2 bg-light border-0" />
                  </Form.Group>

                  <div className="d-grid mt-4">
                    <Button type="submit" size="lg" className="btn-corporate-solid py-2">
                      Ingresar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center py-3 bg-light border-0 d-flex flex-column gap-2">
                <Link to="/register" className="text-decoration-none small fw-bold text-corporate">
                  ¿No tienes cuenta? Regístrate aquí
                </Link>
                <Link to="/" className="text-decoration-none small text-muted">
                  &larr; Volver al Inicio
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;