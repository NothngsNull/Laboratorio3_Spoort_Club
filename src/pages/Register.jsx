import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
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

    setLoading(true);

    try {
      // Petición a la API Real
      await registerUser(name, email, password);
      
      setSuccess('¡Registro exitoso! Redirigiendo al Login...');
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (err) {
      setError(err.message || 'Error al conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light d-flex align-items-center min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-5">
                
                <h2 className="text-center mb-4 fw-bold" style={{ color: '#2E1A47' }}>
                  Registro de Usuario
                </h2>
                
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                {success && <Alert variant="success" className="text-center">{success}</Alert>}

                <Form onSubmit={handleRegister}>
                  <Form.Group className="mb-3" controlId="regName">
                    <Form.Label className="fw-semibold text-secondary">Nombre Completo</Form.Label>
                    <Form.Control type="text" placeholder="Ingresa tu nombre..." required className="py-2" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="regEmail">
                    <Form.Label className="fw-semibold text-secondary">Correo Electrónico</Form.Label>
                    <Form.Control type="email" placeholder="ejemplo@correo.com" required className="py-2" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="regPassword">
                    <Form.Label className="fw-semibold text-secondary">Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="••••••••" required className="py-2" />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="regConfirm">
                    <Form.Label className="fw-semibold text-secondary">Confirmar Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="••••••••" required className="py-2" />
                  </Form.Group>

                  <div className="d-grid gap-3 mt-4">
                    <Button type="submit" size="lg" className="btn-corporate-solid" disabled={loading}>
                      {loading ? 'Registrando...' : 'Registrarse'}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="lg" 
                      onClick={() => navigate('/login')}
                      className="fw-bold border-2"
                      disabled={loading}
                    >
                      Volver
                    </Button>
                  </div>
                </Form>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;