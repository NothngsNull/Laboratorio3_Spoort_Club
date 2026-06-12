import React, { useState } from 'react';
import { Row, Col, Card, Badge, ProgressBar, Table, Button } from 'react-bootstrap';
import { getUser } from '../../services/authService';
 
// ── Datos de demostración ───────────────────────────────────────────────────
const CLASES_DISPONIBLES = [
  { nombre: 'Spinning',      coach: 'Carlos V.',  horario: 'Lunes / 08:00 y 18:00',    cupos: 8  },
  { nombre: 'CrossFit',      coach: 'Laura M.',   horario: 'Miércoles / 10:00 y 19:00', cupos: 5  },
  { nombre: 'Yoga Funcional',coach: 'Andrés P.',  horario: 'Viernes / 19:30',           cupos: 12 },
  { nombre: 'Boxeo',         coach: 'Diego R.',   horario: 'Sábado / 10:00',            cupos: 6  },
  { nombre: 'HIIT',          coach: 'Sofía L.',   horario: 'Jueves / 10:00',            cupos: 10 },
];
 
const RESERVAS_PROXIMAS = [
  { clase: 'CrossFit',       dia: 'Lunes',      hora: '18:00' },
  { clase: 'Spinning',       dia: 'Miércoles',  hora: '08:00' },
  { clase: 'Yoga Funcional', dia: 'Viernes',    hora: '19:30' },
];
 
export default function UserDashboard() {
  const user   = getUser();
  const nombre = user?.full_name || user?.name  || 'Deportista';
  const email  = (user?.email || '').toLowerCase();
 
  const [sesiones]        = useState(6);
  const totalSesiones      = 10;
  const porcentaje         = Math.round((sesiones / totalSesiones) * 100);
 
  const [reservas, setReservas] = useState(RESERVAS_PROXIMAS);
  const [notif,    setNotif]    = useState('');
 
  const reservarClase = (clase) => {
    const yaExiste = reservas.find(r => r.clase === clase.nombre);
    if (yaExiste) {
      setNotif(`Ya tienes reserva en ${clase.nombre}.`);
      setTimeout(() => setNotif(''), 3000);
      return;
    }
    const [dia, hora] = clase.horario.split('/').map(s => s.trim());
    setReservas(prev => [...prev, { clase: clase.nombre, dia, hora }]);
    setNotif(`✅ Reserva confirmada: ${clase.nombre}`);
    setTimeout(() => setNotif(''), 3000);
  };
 
  const cancelarReserva = (idx) => {
    setReservas(prev => prev.filter((_, i) => i !== idx));
  };
 
  return (
    <div>
      {/* ── Bienvenida ─────────────────────────────────────────────────── */}
      <div
        className="rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3"
        style={{ background: 'linear-gradient(135deg, #1a3a6e, #0d6efd)', color: '#fff' }}
      >
        <div>
          <h2 className="fw-bold mb-1">
            Bienvenido, <span style={{ color: '#F2B705' }}>{nombre.split(' ')[0]}</span> 👋
          </h2>
          <p className="mb-0 opacity-75">Tu progreso y actividad en SportClub</p>
        </div>
        <span style={{ fontSize: '3rem' }}>🏅</span>
      </div>
 
      {/* ── Notificación flash ──────────────────────────────────────── */}
      {notif && (
        <div
          className="mb-3 px-3 py-2 rounded-3 text-center fw-semibold"
          style={{ background: '#eafaf1', border: '1px solid #a9dfbf', color: '#1e6b3a', fontSize: '14px' }}
        >
          {notif}
        </div>
      )}
 
      <Row className="g-4 mb-4">
 
        {/* ── Mi Perfil ────────────────────────────────────────────── */}
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>👤 Mi Perfil</h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <span
                  className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-white"
                  style={{ width: 56, height: 56, background: '#2E1A47', fontSize: 22 }}
                >
                  {nombre[0].toUpperCase()}
                </span>
                <div>
                  <p className="fw-bold mb-0" style={{ fontSize: '15px' }}>{nombre}</p>
                  <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{email || 'Sin email'}</p>
                  <Badge bg="primary" className="mt-1">Socio Activo</Badge>
                </div>
              </div>
              <hr />
              <h6 className="fw-bold mb-2" style={{ fontSize: '13px', color: '#2E1A47' }}>🎯 Objetivos Personales</h6>
              <ul className="list-unstyled mb-0" style={{ fontSize: '13px' }}>
                {[
                  'Mejorar resistencia cardiovascular',
                  'Ganar masa muscular',
                  'Asistir 3 veces por semana',
                ].map((obj) => (
                  <li key={obj} className="d-flex align-items-start gap-2 mb-1">
                    <span style={{ color: '#F2B705' }}>★</span>
                    <span className="text-muted">{obj}</span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
 
        {/* ── Progreso + Reservas ───────────────────────────────────── */}
        <Col md={8}>
          <Row className="g-4 h-100">
 
            {/* Progreso */}
            <Col xs={12}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0" style={{ color: '#2E1A47' }}>📈 Tu Progreso General</h5>
                    <Badge
                      style={{ background: '#F2B705', color: '#2E1A47', fontWeight: 700 }}
                    >
                      {sesiones} / {totalSesiones} sesiones
                    </Badge>
                  </div>
                  <ProgressBar
                    now={porcentaje}
                    label={`${porcentaje}%`}
                    style={{ height: 20, borderRadius: 10, background: '#e9ecef' }}
                    variant="success"
                    className="mb-2"
                  />
                  <small className="text-muted">
                    Llevas {sesiones} de {totalSesiones} sesiones completadas este mes.
                    {porcentaje >= 80 ? ' 🔥 ¡Excelente racha!' : ' ¡Sigue así!'}
                  </small>
                </Card.Body>
              </Card>
            </Col>
 
            {/* Próximas reservas */}
            <Col xs={12}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>📌 Mis Reservas Próximas</h5>
                  {reservas.length === 0 ? (
                    <p className="text-muted small text-center py-2">No tienes reservas activas.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {reservas.map((r, i) => (
                        <div
                          key={i}
                          className="d-flex align-items-center justify-content-between p-2 rounded-3"
                          style={{ background: '#f8f5ff', border: '1px solid #e0d5f5' }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="rounded-2 d-inline-flex align-items-center justify-content-center"
                              style={{ width: 8, height: 8, background: '#2E1A47', borderRadius: '50%' }}
                            />
                            <span className="fw-semibold" style={{ fontSize: '13px' }}>{r.clase}</span>
                            <span className="text-muted" style={{ fontSize: '12px' }}>
                              — {r.dia} {r.hora}
                            </span>
                          </div>
                          <button
                            onClick={() => cancelarReserva(i)}
                            className="btn btn-sm btn-outline-danger py-0 px-2"
                            style={{ fontSize: '11px' }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
 
      {/* ── Clases disponibles ───────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>🗓️ Horario Completo — Clases Disponibles</h5>
          <div className="table-responsive">
            <Table hover className="align-middle mb-0" style={{ fontSize: '14px' }}>
              <thead style={{ background: '#f8f5ff' }}>
                <tr>
                  <th>Clase</th>
                  <th>Entrenador</th>
                  <th>Horario</th>
                  <th>Cupos</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {CLASES_DISPONIBLES.map((c) => {
                  const reservada = reservas.find(r => r.clase === c.nombre);
                  return (
                    <tr key={c.nombre}>
                      <td className="fw-semibold">{c.nombre}</td>
                      <td className="text-muted">{c.coach}</td>
                      <td>{c.horario}</td>
                      <td>
                        <Badge
                          bg={c.cupos > 8 ? 'success' : c.cupos > 3 ? 'warning' : 'danger'}
                          text={c.cupos > 3 ? 'dark' : 'white'}
                        >
                          {c.cupos} cupos
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          onClick={() => reservarClase(c)}
                          disabled={!!reservada}
                          style={{
                            background: reservada ? '#dee2e6' : '#F2B705',
                            border: 'none',
                            color: reservada ? '#888' : '#2E1A47',
                            fontWeight: 700,
                            fontSize: '12px'
                          }}
                        >
                          {reservada ? '✅ Reservada' : 'Reservar'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
 