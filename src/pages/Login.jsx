import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/user/dashboard');
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
              <Card.Body className="p-5 bg-white">
                <h4 className="text-center mb-4 fw-bold text-dark">Iniciar Sesión</h4>
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-4" controlId="loginEmail">
                    <Form.Label className="fw-bold text-secondary">Correo electrónico</Form.Label>
                    <Form.Control type="email" placeholder="usuario@ejemplo.com" required className="py-2 bg-light border-0" />
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
              <Card.Footer className="text-center py-3 bg-light border-0">
                <Link to="/" className="text-decoration-none small text-muted fw-bold">
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