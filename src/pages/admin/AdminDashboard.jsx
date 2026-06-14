import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Table, Badge, Spinner, Alert,
  Button, Modal, Form
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getToken, getUser } from '../../services/authService';

const API = 'http://localhost:3000/api';

// ── Tarjeta de estadística ────────────────────────────────────────────────────
function StatCard({ titulo, valor, icono, color }) {
  return (
    <Card className="border-0 shadow-sm h-100" style={{ borderLeft: `5px solid ${color}` }}>
      <Card.Body className="d-flex align-items-center gap-3 p-4">
        <span style={{ fontSize: '2rem' }}>{icono}</span>
        <div>
          <p className="text-muted mb-0" style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
            {titulo}
          </p>
          <p className="fw-bold mb-0" style={{ fontSize: '28px', color: '#2E1A47' }}>
            {valor ?? <Spinner animation="border" size="sm" />}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
}

// ── Badge de rol ──────────────────────────────────────────────────────────────
function RolBadge({ rol }) {
  if (rol === 'admin') return <Badge bg="danger">Admin</Badge>;
  if (rol === 'coach') return <Badge bg="success">Coach</Badge>;
  return <Badge bg="primary">Usuario</Badge>;
}

// ── Días de la semana para el selector de horario ─────────────────────────────
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// ── Horario vacío inicial ─────────────────────────────────────────────────────
const horarioVacio = () =>
  DIAS.reduce((acc, dia) => ({ ...acc, [dia]: '' }), {});

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const token   = getToken();
  const adminMe = getUser();
  const navigate = useNavigate();

  // ── Estado: usuarios de la BD ─────────────────────────────────────────────
  const [usuarios, setUsuarios] = useState(null);
  const [error,    setError]    = useState('');

  // ── Estado: modal de Gestión de Coaches ──────────────────────────────────
  const [modalCoach,     setModalCoach]     = useState(false);
  const [coachSeleccionado, setCoachSeleccionado] = useState(null);
  // Horarios guardados: { [coachId]: { Lunes: '08:00 Spinning', ... } }
  const [horarios, setHorarios] = useState({});
  const [horarioActual, setHorarioActual] = useState(horarioVacio());
  const [guardado, setGuardado] = useState(false);

  // ── Cargar usuarios desde la API (base de datos real) ────────────────────
  useEffect(() => {
    if (!token) return;

    fetch(`${API}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then(data => {
        // Normaliza cualquier forma de respuesta del backend
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.users)
              ? data.users
              : [];
        setUsuarios(lista);
      })
      .catch(() => setError('No se pudo conectar con el servidor (puerto 3000).'));
  }, [token]);

  // ── Derivados de la lista ─────────────────────────────────────────────────
  const totalUsuarios = usuarios ? usuarios.filter(u => u.role === 'user').length  : null;
  const totalCoaches  = usuarios ? usuarios.filter(u => u.role === 'coach').length : null;
  const totalAdmins   = usuarios ? usuarios.filter(u => u.role === 'admin').length : null;
  const coaches       = usuarios ? usuarios.filter(u => u.role === 'coach')        : [];

  // ── Abrir modal de horario para un coach específico ───────────────────────
  const abrirModalCoach = (coach) => {
    setCoachSeleccionado(coach);
    const id = coach.id ?? coach._id;
    setHorarioActual(horarios[id] ?? horarioVacio());
    setGuardado(false);
    setModalCoach(true);
  };

  const cerrarModalCoach = () => {
    setModalCoach(false);
    setCoachSeleccionado(null);
  };

  const guardarHorario = () => {
    const id = coachSeleccionado.id ?? coachSeleccionado._id;
    setHorarios(prev => ({ ...prev, [id]: { ...horarioActual } }));
    setGuardado(true);
    // Cerrar el modal automáticamente después de 1.2 s
    setTimeout(() => cerrarModalCoach(), 1200);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ── Banner de bienvenida ─────────────────────────────────────── */}
      <div
        className="rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3"
        style={{ background: 'linear-gradient(135deg, #2E1A47, #4a2d6e)', color: '#fff' }}
      >
        <div>
          <h2 className="fw-bold mb-1">Panel de Administración</h2>
          <p className="mb-0 opacity-75">
            Bienvenido, <strong>{adminMe?.full_name || adminMe?.name || 'Administrador'}</strong> —
            gestión integral del sistema SportClub
          </p>
        </div>
        <span style={{ fontSize: '3rem' }}>⚙️</span>
      </div>

      {/* ── Tarjetas de estadísticas ─────────────────────────────────── */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <StatCard titulo="Usuarios Activos"  valor={totalUsuarios}        icono="👥" color="#2E1A47" />
        </Col>
        <Col sm={6} lg={3}>
          <StatCard titulo="Coaches"           valor={totalCoaches}         icono="🏋️" color="#F2B705" />
        </Col>
        <Col sm={6} lg={3}>
          <StatCard titulo="Administradores"   valor={totalAdmins}          icono="🛡️" color="#dc3545" />
        </Col>
        <Col sm={6} lg={3}>
          <StatCard titulo="Total Registrados" valor={usuarios?.length ?? null} icono="📊" color="#198754" />
        </Col>
      </Row>

      {/* ── Fila principal ───────────────────────────────────────────── */}
      <Row className="g-4 mb-4">

        {/* ── Tabla REAL de usuarios (todos, con scroll) ───────────── */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#2E1A47' }}>
                  👥 Usuarios Registrados
                </h5>
                {usuarios && (
                  <small className="text-muted">{usuarios.length} en total</small>
                )}
              </div>

              {/* Error de conexión */}
              {error && (
                <Alert variant="danger" className="py-2 small">{error}</Alert>
              )}

              {/* Cargando */}
              {!usuarios && !error && (
                <div className="text-center py-4">
                  <Spinner animation="border" style={{ color: '#2E1A47' }} />
                  <p className="text-muted mt-2 small">Cargando usuarios...</p>
                </div>
              )}

              {/* Tabla con todos los usuarios reales */}
              {usuarios && (
                <div
                  className="table-responsive"
                  style={{ maxHeight: 340, overflowY: 'auto' }}
                >
                  <Table hover className="align-middle mb-0" style={{ fontSize: '13px' }}>
                    <thead
                      style={{ background: '#f8f5ff', position: 'sticky', top: 0, zIndex: 1 }}
                    >
                      <tr>
                        <th style={{ color: '#2E1A47' }}>#</th>
                        <th style={{ color: '#2E1A47' }}>Nombre</th>
                        <th style={{ color: '#2E1A47' }}>Email</th>
                        <th style={{ color: '#2E1A47' }}>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center text-muted py-4">
                            No hay usuarios registrados.
                          </td>
                        </tr>
                      ) : (
                        usuarios.map((u, i) => (
                          <tr key={u.id ?? u._id ?? i}>
                            <td>
                              <span
                                className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-white"
                                style={{ width: 30, height: 30, background: '#2E1A47', fontSize: 11 }}
                              >
                                {(u.full_name || u.name || '?')[0].toUpperCase()}
                              </span>
                            </td>
                            <td className="fw-semibold">{u.full_name || u.name || '—'}</td>
                            <td className="text-muted">{(u.email || '—').toLowerCase()}</td>
                            <td><RolBadge rol={u.role} /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* ── Accesos rápidos (solo los que tienen función real) ───── */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>🚀 Gestión Rápida</h5>
              <div className="d-grid gap-2">

                {/* BOTÓN 1: navega al CRUD real de usuarios */}
                <button
                  className="btn text-start p-3 border rounded-3 bg-white"
                  style={{ transition: 'all .2s' }}
                  onClick={() => navigate('/admin/users')}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8f5ff'; e.currentTarget.style.borderColor = '#2E1A47'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff';    e.currentTarget.style.borderColor = '#dee2e6'; }}
                >
                  <p className="mb-0 fw-semibold" style={{ fontSize: '14px', color: '#2E1A47' }}>
                    👥 Gestión de Usuarios
                  </p>
                  <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                    Alta, baja y edición de cuentas
                  </p>
                </button>

                {/* BOTÓN 2: abre modal de asignación de horario a coaches */}
                <button
                  className="btn text-start p-3 border rounded-3 bg-white"
                  style={{ transition: 'all .2s' }}
                  onClick={() => {
                    // Si hay un solo coach, lo abre directo. Si hay varios, abre el primero.
                    if (coaches.length === 1) {
                      abrirModalCoach(coaches[0]);
                    } else if (coaches.length > 1) {
                      // Scroll hacia la sección de coaches de la tabla y abrir el primero
                      abrirModalCoach(coaches[0]);
                    }
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8f5ff'; e.currentTarget.style.borderColor = '#2E1A47'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff';    e.currentTarget.style.borderColor = '#dee2e6'; }}
                >
                  <p className="mb-0 fw-semibold" style={{ fontSize: '14px', color: '#2E1A47' }}>
                    🏋️ Gestión de Coaches
                  </p>
                  <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>
                    Asignar horario semanal por coach
                  </p>
                </button>

              </div>
            </Card.Body>
          </Card>

          {/* ── Lista de coaches con botón de horario ──────────────── */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>🏋️ Coaches del Club</h5>

              {!usuarios && !error && (
                <div className="text-center py-2">
                  <Spinner animation="border" size="sm" style={{ color: '#198754' }} />
                </div>
              )}

              {usuarios && coaches.length === 0 && (
                <p className="text-muted small mb-0">No hay coaches registrados.</p>
              )}

              {coaches.map((c) => {
                const id = c.id ?? c._id;
                const tieneHorario = Boolean(
                  horarios[id] && Object.values(horarios[id]).some(v => v.trim())
                );
                return (
                  <div
                    key={id}
                    className="d-flex align-items-center justify-content-between py-2"
                    style={{ borderBottom: '1px solid #f0f0f0' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-white"
                        style={{ width: 32, height: 32, background: '#198754', fontSize: 12 }}
                      >
                        {(c.full_name || c.name || '?')[0].toUpperCase()}
                      </span>
                      <div>
                        <p className="mb-0 fw-semibold" style={{ fontSize: '13px' }}>
                          {c.full_name || c.name}
                        </p>
                        <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>
                          {tieneHorario ? '✅ Horario asignado' : '⏳ Sin horario'}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => abrirModalCoach(c)}
                      style={{
                        background: tieneHorario ? '#198754' : '#F2B705',
                        border: 'none',
                        color: tieneHorario ? '#fff' : '#2E1A47',
                        fontWeight: 700,
                        fontSize: '11px',
                      }}
                    >
                      {tieneHorario ? 'Editar' : 'Asignar'}
                    </Button>
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ── Distribución por rol ─────────────────────────────────────── */}
      {usuarios && (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>📊 Distribución por Rol</h5>
            <Row className="g-3 text-center">
              {[
                { label: 'Usuarios',        valor: totalUsuarios, color: '#2E1A47', bg: '#f0ebff' },
                { label: 'Coaches',         valor: totalCoaches,  color: '#d9a404', bg: '#fff8e1' },
                { label: 'Administradores', valor: totalAdmins,   color: '#dc3545', bg: '#fff0f0' },
              ].map(({ label, valor, color, bg }) => (
                <Col key={label} md={4}>
                  <div className="p-3 rounded-3" style={{ background: bg }}>
                    <p className="fw-bold mb-1" style={{ fontSize: '32px', color }}>{valor ?? '—'}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>{label}</p>
                    {usuarios.length > 0 && (
                      <div className="mt-2 rounded-pill overflow-hidden" style={{ height: 6, background: '#e9ecef' }}>
                        <div
                          className="rounded-pill"
                          style={{
                            height: '100%',
                            width: `${Math.round(((valor || 0) / usuarios.length) * 100)}%`,
                            background: color,
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* ── Modal: asignar horario a un coach ────────────────────────── */}
      <Modal show={modalCoach} onHide={cerrarModalCoach} centered size="lg">
        <Modal.Header
          closeButton
          style={{ background: '#2E1A47', borderBottom: '3px solid #F2B705' }}
        >
          <Modal.Title style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>
            📅 Horario Semanal —{' '}
            {coachSeleccionado?.full_name || coachSeleccionado?.name || 'Coach'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: '#fafafa' }}>
          <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
            Escribe la clase y horario para cada día. Deja el campo vacío si el coach no tiene clases ese día.
          </p>
          <Row className="g-2">
            {DIAS.map(dia => (
              <Col xs={12} sm={6} key={dia}>
                <Form.Group>
                  <Form.Label
                    className="fw-semibold mb-1"
                    style={{ fontSize: '13px', color: '#2E1A47' }}
                  >
                    {dia}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Spinning 08:00 / Libre"
                    value={horarioActual[dia]}
                    onChange={e =>
                      setHorarioActual(prev => ({ ...prev, [dia]: e.target.value }))
                    }
                    style={{ fontSize: '13px' }}
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>

          {guardado && (
            <div
              className="mt-3 p-2 rounded-3 text-center fw-semibold"
              style={{ background: '#eafaf1', border: '1px solid #a9dfbf', color: '#1e6b3a', fontSize: '13px' }}
            >
              ✅ Horario guardado correctamente
            </div>
          )}
        </Modal.Body>

        <Modal.Footer style={{ background: '#f5f5f5' }}>
          <Button variant="secondary" onClick={cerrarModalCoach} style={{ fontSize: '13px' }}>
            Cancelar
          </Button>
          <Button
            onClick={guardarHorario}
            style={{
              background: '#F2B705',
              border: 'none',
              color: '#2E1A47',
              fontWeight: 700,
              fontSize: '13px',
            }}
          >
            Guardar Horario
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}