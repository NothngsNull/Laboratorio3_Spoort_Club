import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, saveSession } from '../services/authService';
 
function Login() {
  const navigate = useNavigate();
 
  // error general de la API
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  // errores por campo (sin alert, sin required nativo)
  const [errEmail, setErrEmail]     = useState('');
  const [errPass,  setErrPass]      = useState('');
 
  // borde rojo por campo
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPass,  setTouchedPass]  = useState(false);
 
  const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
 
    const email    = e.target.loginEmail.value.trim().toLowerCase();
    const password = e.target.loginPassword.value;
 
    // Validación manual — sin alert, sin required
    let valido = true;
 
    if (!email) {
      setErrEmail('El correo electrónico es obligatorio.');
      valido = false;
    } else if (!emailValido(email)) {
      setErrEmail('Ingresa un correo válido. Ej: usuario@mail.com');
      valido = false;
    } else {
      setErrEmail('');
    }
 
    if (!password) {
      setErrPass('La contraseña es obligatoria.');
      valido = false;
    } else if (password.length < 6) {
      setErrPass('La contraseña debe tener al menos 6 caracteres.');
      valido = false;
    } else {
      setErrPass('');
    }
 
    if (!valido) return;
 
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      saveSession(data.token, data.user);
 
      const rol = data.user.role;
      if (rol === 'admin')      navigate('/admin/dashboard');
      else if (rol === 'coach') navigate('/coach/dashboard');
      else                      navigate('/user/dashboard');
 
    } catch (err) {
      console.error('[Login error]', err.message);
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="bg-corporate d-flex align-items-center min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card
              className="border-0 shadow-lg rounded-4 overflow-hidden"
              style={{ borderTop: '5px solid #F2B705' }}
            >
              {/* Header con marca */}
              <Card.Header className="bg-white text-center py-4 border-0">
                <h2 className="fw-bold text-corporate mb-0">
                  Sport<span className="text-corporate-accent">Club</span>
                </h2>
              </Card.Header>
 
              <Card.Body className="p-4 bg-white">
                <h4 className="text-center mb-4 fw-bold text-dark">Iniciar Sesión</h4>
 
                {/* Error general de la API */}
                {error && (
                  <div
                    className="mb-3 px-3 py-2 rounded-3 text-center fw-semibold"
                    style={{
                      color: '#c0392b',
                      background: '#fdf0ef',
                      border: '1px solid #f5c6c2',
                      fontSize: '13px'
                    }}
                  >
                    {error}
                  </div>
                )}
 
                {/* noValidate desactiva el popup nativo del browser */}
                <Form onSubmit={handleLogin} noValidate>
 
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label className="fw-bold text-secondary">
                      Correo electrónico
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="usuario@correo.com"
                      className={`py-2 bg-light border-1 ${errEmail ? 'is-invalid' : touchedEmail ? 'is-valid' : ''}`}
                      onBlur={(e) => {
                        setTouchedEmail(true);
                        const v = e.target.value.trim();
                        if (!v) setErrEmail('El correo electrónico es obligatorio.');
                        else if (!emailValido(v)) setErrEmail('Ingresa un correo válido. Ej: usuario@mail.com');
                        else setErrEmail('');
                      }}
                      onChange={() => { if (errEmail) setErrEmail(''); }}
                    />
                    {/* Mensaje debajo del input, sin alert */}
                    {errEmail && (
                      <div className="invalid-feedback d-block" style={{ fontSize: '12px', fontWeight: 600 }}>
                        {errEmail}
                      </div>
                    )}
                  </Form.Group>
 
                  <Form.Group className="mb-4" controlId="loginPassword">
                    <Form.Label className="fw-bold text-secondary">Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      className={`py-2 bg-light border-1 ${errPass ? 'is-invalid' : touchedPass ? 'is-valid' : ''}`}
                      onBlur={(e) => {
                        setTouchedPass(true);
                        const v = e.target.value;
                        if (!v) setErrPass('La contraseña es obligatoria.');
                        else if (v.length < 6) setErrPass('La contraseña debe tener al menos 6 caracteres.');
                        else setErrPass('');
                      }}
                      onChange={() => { if (errPass) setErrPass(''); }}
                    />
                    {errPass && (
                      <div className="invalid-feedback d-block" style={{ fontSize: '12px', fontWeight: 600 }}>
                        {errPass}
                      </div>
                    )}
                  </Form.Group>
 
                  <div className="d-grid mt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="btn-corporate-solid py-2"
                      disabled={loading}
                    >
                      {loading ? 'Conectando...' : 'Ingresar'}
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