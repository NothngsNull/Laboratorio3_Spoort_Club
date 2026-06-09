import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
 
function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
 
  // error general de API
  const [errorGeneral, setErrorGeneral] = useState('');
 
  // errores por campo
  const [errNombre,   setErrNombre]   = useState('');
  const [errEdad,     setErrEdad]     = useState('');
  const [errEmail,    setErrEmail]    = useState('');
  const [errPass,     setErrPass]     = useState('');
  const [errConfirm,  setErrConfirm]  = useState('');
 
  // fortaleza de contraseña
  const [fortaleza, setFortaleza] = useState({ ancho: '0%', color: '#eee', label: '' });
 
  const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
 
  // calcula la fortaleza visual de la contraseña
  const calcularFortaleza = (pass) => {
    if (!pass) return { ancho: '0%', color: '#eee', label: '' };
    let pts = 0;
    if (pass.length >= 8)          pts++;
    if (pass.length >= 12)         pts++;
    if (/[A-Z]/.test(pass))        pts++;
    if (/[0-9]/.test(pass))        pts++;
    if (/[^a-zA-Z0-9]/.test(pass)) pts++;
    const niveles = [
      { ancho: '20%',  color: '#e74c3c', label: 'Muy débil' },
      { ancho: '40%',  color: '#e67e22', label: 'Débil'     },
      { ancho: '60%',  color: '#f1c40f', label: 'Regular'   },
      { ancho: '80%',  color: '#2ecc71', label: 'Buena'     },
      { ancho: '100%', color: '#27ae60', label: 'Fuerte'    },
    ];
    return niveles[Math.min(pts, 4)];
  };
 
  // validación de todos los campos — retorna true si todo está OK
  const validar = (campos) => {
    let valido = true;
 
    // Nombre
    if (!campos.nombre) {
      setErrNombre('El nombre es obligatorio.');
      valido = false;
    } else if (campos.nombre.length < 3) {
      setErrNombre('El nombre debe tener al menos 3 caracteres.');
      valido = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(campos.nombre)) {
      setErrNombre('El nombre solo puede contener letras.');
      valido = false;
    } else {
      setErrNombre('');
    }
 
    // Edad (opcional)
    if (campos.edad !== '') {
      const n = Number(campos.edad);
      if (isNaN(n) || n < 5 || n > 120) {
        setErrEdad('Ingresa una edad válida (entre 5 y 120).');
        valido = false;
      } else {
        setErrEdad('');
      }
    } else {
      setErrEdad('');
    }
 
    // Email
    if (!campos.email) {
      setErrEmail('El correo electrónico es obligatorio.');
      valido = false;
    } else if (!emailValido(campos.email)) {
      setErrEmail('Ingresa un correo válido. Ej: usuario@mail.com');
      valido = false;
    } else {
      setErrEmail('');
    }
 
    // Contraseña
    if (!campos.password) {
      setErrPass('La contraseña es obligatoria.');
      valido = false;
    } else if (campos.password.length < 8) {
      setErrPass('Mínimo 8 caracteres.');
      valido = false;
    } else if (!/[a-zA-Z]/.test(campos.password)) {
      setErrPass('Debe incluir al menos una letra.');
      valido = false;
    } else if (!/[0-9]/.test(campos.password)) {
      setErrPass('Debe incluir al menos un número.');
      valido = false;
    } else {
      setErrPass('');
    }
 
    // Confirmar
    if (!campos.confirm) {
      setErrConfirm('Debes confirmar la contraseña.');
      valido = false;
    } else if (campos.confirm !== campos.password) {
      setErrConfirm('Las contraseñas no coinciden.');
      valido = false;
    } else {
      setErrConfirm('');
    }
 
    return valido;
  };
 
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorGeneral('');
 
    const campos = {
      nombre:   e.target.regNombre.value.trim(),
      edad:     e.target.regEdad?.value.trim() ?? '',
      email:    e.target.regEmail.value.trim().toLowerCase(),
      password: e.target.regPassword.value,
      confirm:  e.target.regConfirm.value,
      deporte:  e.target.regDeporte?.value ?? '',
      objetivo: e.target.regObjetivo?.value.trim() ?? '',
      nivel:    e.target.regNivel?.value ?? '',
      info:     e.target.regInfo?.value.trim() ?? '',
    };
 
    if (!validar(campos)) return;
 
    // construir birth_date aproximada desde edad
    let birth_date = null;
    if (campos.edad) {
      const anio = new Date().getFullYear() - Number(campos.edad);
      birth_date = `${anio}-01-01`;
    }
 
    setLoading(true);
    try {
      await registerUser(campos.nombre, campos.email, campos.password, {
        birth_date,
        metadata: {
          practica_deporte: campos.deporte === 'si',
          objetivo: campos.objetivo || null,
          nivel:    campos.nivel    || null,
          info_adicional: campos.info || null,
        }
      });
      navigate('/login?registro=ok');
    } catch (err) {
      console.error('[Register error]', err.message);
      const msg = err.message.toLowerCase();
      if (msg.includes('email') || msg.includes('correo') || msg.includes('exist')) {
        setErrEmail('Este correo ya está registrado. Usa otro.');
      } else {
        setErrorGeneral('No se pudo completar el registro. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };
 
  // estilos reutilizables para los mensajes de error debajo del input
  const estiloError = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#c0392b',
    marginTop: '3px',
  };
 
  // borde rojo/verde en el input según si tiene error
  const claseInput = (err, tocado) =>
    `py-2 bg-light ${err ? 'is-invalid border-danger' : tocado ? 'is-valid' : ''}`;
 
  return (
    <div className="bg-corporate d-flex align-items-center min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          {/* Más ancho que el login porque tiene más campos — igual que el registerC.html original */}
          <Col md={10} lg={8} xl={7}>
            <Card
              className="border-0 shadow-lg rounded-4 overflow-hidden"
              style={{ borderTop: '5px solid #F2B705' }}
            >
              {/* Header con marca — igual que Login */}
              <Card.Header className="bg-white text-center py-4 border-0">
                <h2 className="fw-bold text-corporate mb-0">
                  Sport<span className="text-corporate-accent">Club</span>
                </h2>
              </Card.Header>
 
              <Card.Body className="p-4 p-md-5 bg-white">
                <h4 className="text-center mb-4 fw-bold text-dark">Registro de usuario</h4>
 
                {/* Error general de API */}
                {errorGeneral && (
                  <div
                    className="mb-3 px-3 py-2 rounded-3 text-center fw-semibold"
                    style={{
                      color: '#c0392b',
                      background: '#fdf0ef',
                      border: '1px solid #f5c6c2',
                      fontSize: '13px'
                    }}
                  >
                    {errorGeneral}
                  </div>
                )}
 
                {/* noValidate desactiva los popups nativos del browser */}
                <Form onSubmit={handleRegister} noValidate>
 
                  {/* ---- Layout de dos columnas igual al registerC.html original ---- */}
                  <Row>
 
                    {/* COLUMNA IZQUIERDA */}
                    <Col md={6} className="pe-md-4 border-end-md">
 
                      <Form.Group className="mb-3" controlId="regNombre">
                        <Form.Label className="fw-bold text-corporate">Nombre *</Form.Label>
                        <Form.Control
                          type="text"
                          name="regNombre"
                          placeholder="Tu nombre completo"
                          className={claseInput(errNombre, false)}
                          onChange={() => { if (errNombre) setErrNombre(''); }}
                          onBlur={(e) => {
                            const v = e.target.value.trim();
                            if (!v) setErrNombre('El nombre es obligatorio.');
                            else if (v.length < 3) setErrNombre('Mínimo 3 caracteres.');
                            else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v)) setErrNombre('Solo letras.');
                            else setErrNombre('');
                          }}
                        />
                        {errNombre && <div style={estiloError}>{errNombre}</div>}
                      </Form.Group>
 
                      <Form.Group className="mb-3" controlId="regEdad">
                        <Form.Label className="fw-bold text-corporate">Edad</Form.Label>
                        <Form.Control
                          type="number"
                          name="regEdad"
                          min={5}
                          max={120}
                          placeholder="Tu edad"
                          className={claseInput(errEdad, false)}
                          onChange={() => { if (errEdad) setErrEdad(''); }}
                        />
                        {errEdad && <div style={estiloError}>{errEdad}</div>}
                      </Form.Group>
 
                      <hr className="border-2 my-3" style={{ borderColor: '#d9e6f2' }} />
 
                      <Form.Group className="mb-3" controlId="regDeporte">
                        <Form.Label className="fw-bold text-corporate">¿Practica deporte?</Form.Label>
                        <Form.Select name="regDeporte" className="py-2 bg-light">
                          <option value="">Seleccione una opción</option>
                          <option value="si">Sí</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
 
                      <Form.Group className="mb-3" controlId="regObjetivo">
                        <Form.Label className="fw-bold text-corporate">Objetivo personal</Form.Label>
                        <Form.Control
                          type="text"
                          name="regObjetivo"
                          placeholder="Ej. Bajar de peso"
                          className="py-2 bg-light"
                        />
                      </Form.Group>
 
                      <Form.Group className="mb-3" controlId="regNivel">
                        <Form.Label className="fw-bold text-corporate">Nivel</Form.Label>
                        <Form.Select name="regNivel" className="py-2 bg-light">
                          <option value="">Seleccione nivel</option>
                          <option value="principiante">Principiante</option>
                          <option value="intermedio">Intermedio</option>
                          <option value="avanzado">Avanzado</option>
                        </Form.Select>
                      </Form.Group>
 
                    </Col>
 
                    {/* COLUMNA DERECHA */}
                    <Col md={6} className="ps-md-4">
 
                      <Form.Group className="mb-3" controlId="regEmail">
                        <Form.Label className="fw-bold text-corporate">Correo electrónico *</Form.Label>
                        <Form.Control
                          type="email"
                          name="regEmail"
                          placeholder="ejemplo@mail.com"
                          className={claseInput(errEmail, false)}
                          onChange={() => { if (errEmail) setErrEmail(''); }}
                          onBlur={(e) => {
                            const v = e.target.value.trim();
                            if (!v) setErrEmail('El correo es obligatorio.');
                            else if (!emailValido(v)) setErrEmail('Correo inválido. Ej: usuario@mail.com');
                            else setErrEmail('');
                          }}
                        />
                        {errEmail && <div style={estiloError}>{errEmail}</div>}
                      </Form.Group>
 
                      <Form.Group className="mb-1" controlId="regPassword">
                        <Form.Label className="fw-bold text-corporate">Contraseña *</Form.Label>
                        <Form.Control
                          type="password"
                          name="regPassword"
                          placeholder="Mínimo 8 caracteres, letras y números"
                          className={claseInput(errPass, false)}
                          onChange={(e) => {
                            if (errPass) setErrPass('');
                            setFortaleza(calcularFortaleza(e.target.value));
                          }}
                          onBlur={(e) => {
                            const v = e.target.value;
                            if (!v) setErrPass('La contraseña es obligatoria.');
                            else if (v.length < 8) setErrPass('Mínimo 8 caracteres.');
                            else if (!/[a-zA-Z]/.test(v)) setErrPass('Debe incluir al menos una letra.');
                            else if (!/[0-9]/.test(v)) setErrPass('Debe incluir al menos un número.');
                            else setErrPass('');
                          }}
                        />
                        {/* Barra de fortaleza */}
                        {fortaleza.label && (
                          <div className="mt-1 mb-1">
                            <div style={{ height: '5px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: fortaleza.ancho,
                                background: fortaleza.color,
                                borderRadius: '4px',
                                transition: 'width 0.3s, background 0.3s'
                              }} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: fortaleza.color }}>
                              {fortaleza.label}
                            </span>
                          </div>
                        )}
                        {errPass && <div style={estiloError}>{errPass}</div>}
                      </Form.Group>
 
                      <Form.Group className="mb-3" controlId="regConfirm">
                        <Form.Label className="fw-bold text-corporate">Repetir contraseña *</Form.Label>
                        <Form.Control
                          type="password"
                          name="regConfirm"
                          placeholder="Repite tu contraseña"
                          className={claseInput(errConfirm, false)}
                          onChange={(e) => {
                            if (errConfirm) setErrConfirm('');
                            // coincidencia en vivo
                            const passEl = document.querySelector('[name="regPassword"]');
                            if (passEl && e.target.value && e.target.value !== passEl.value) {
                              setErrConfirm('Las contraseñas no coinciden.');
                            } else if (passEl && e.target.value === passEl.value) {
                              setErrConfirm('');
                            }
                          }}
                        />
                        {errConfirm && <div style={estiloError}>{errConfirm}</div>}
                      </Form.Group>
 
                      <Form.Group className="mb-3" controlId="regInfo">
                        <Form.Label className="fw-bold text-corporate">
                          Información adicional (opcional)
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          name="regInfo"
                          rows={4}
                          placeholder="Algún detalle extra que quieras contarnos..."
                          className="bg-light"
                          style={{ resize: 'none' }}
                        />
                      </Form.Group>
 
                    </Col>
                  </Row>
 
                  {/* Botones */}
                  <div className="d-grid gap-2 mt-3">
                    <Button
                      type="submit"
                      size="lg"
                      className="btn-corporate-solid py-2"
                      disabled={loading}
                    >
                      {loading ? 'Registrando...' : 'Registrarse'}
                    </Button>
                  </div>
 
                </Form>
              </Card.Body>
 
              <Card.Footer className="text-center py-3 bg-light border-0 d-flex flex-column gap-2">
                <Link to="/login" className="text-decoration-none small fw-bold text-corporate">
                  ¿Ya tienes cuenta? Inicia sesión aquí
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
 
export default Register;