import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Table, Badge, Spinner, Alert,
  Button
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../services/authService';
import { getUsers } from '../../services/userService';
import { getSports } from '../../services/sportService';
import { getRooms } from '../../services/roomService';
import { getSchedules, getSportRooms } from '../../services/classService';

const DIAS_MAP = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' };

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

function RolBadge({ rol }) {
  if (rol === 'admin') return <Badge bg="danger">Admin</Badge>;
  if (rol === 'coach') return <Badge bg="success">Coach</Badge>;
  return <Badge bg="primary">Usuario</Badge>;
}

export default function AdminDashboard() {
  const adminMe = getUser();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState(null);
  const [sports, setSports] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [schedules, setSchedules] = useState(null);
  const [sportRooms, setSportRooms] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getUsers(),
      getSports(),
      getRooms(),
      getSchedules(),
      getSportRooms(),
    ])
      .then(([usersData, sportsData, roomsData, schedData, srData]) => {
        setUsuarios(usersData);
        setSports(sportsData);
        setRooms(roomsData);
        setSchedules(schedData);
        setSportRooms(srData);
      })
      .catch((err) => setError(err.message || 'No se pudo conectar con el servidor (puerto 3000).'));
  }, []);

  const totalUsuarios = usuarios ? usuarios.filter((u) => u.role === 'user').length : null;
  const totalCoaches = usuarios ? usuarios.filter((u) => u.role === 'coach').length : null;
  const totalAdmins = usuarios ? usuarios.filter((u) => u.role === 'admin').length : null;
  const totalSports = sports?.length ?? null;
  const totalRooms = rooms?.length ?? null;
  const totalSchedules = schedules?.length ?? null;

  return (
    <div>
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

      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <StatCard titulo="Usuarios Activos" valor={totalUsuarios} icono="👥" color="#2E1A47" />
        </Col>
        <Col sm={6} lg={3}>
          <StatCard titulo="Coaches" valor={totalCoaches} icono="🏋️" color="#F2B705" />
        </Col>
        <Col sm={6} lg={3}>
          <StatCard titulo="Deportes" valor={totalSports} icono="🏅" color="#dc3545" />
        </Col>
        <Col sm={6} lg={3}>
          <StatCard titulo="Clases" valor={totalSchedules} icono="📅" color="#198754" />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#2E1A47' }}>
                  👥 Usuarios Registrados
                </h5>
                {usuarios && <small className="text-muted">{usuarios.length} en total</small>}
              </div>

              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

              {!usuarios && !error && (
                <div className="text-center py-4">
                  <Spinner animation="border" style={{ color: '#2E1A47' }} />
                  <p className="text-muted mt-2 small">Cargando usuarios...</p>
                </div>
              )}

              {usuarios && (
                <div className="table-responsive" style={{ maxHeight: 340, overflowY: 'auto' }}>
                  <Table hover className="align-middle mb-0" style={{ fontSize: '13px' }}>
                    <thead style={{ background: '#f8f5ff', position: 'sticky', top: 0, zIndex: 1 }}>
                      <tr>
                        <th style={{ color: '#2E1A47' }}>#</th>
                        <th style={{ color: '#2E1A47' }}>Nombre</th>
                        <th style={{ color: '#2E1A47' }}>Email</th>
                        <th style={{ color: '#2E1A47' }}>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.length === 0 ? (
                        <tr><td colSpan={4} className="text-center text-muted py-4">No hay usuarios registrados.</td></tr>
                      ) : (
                        usuarios.map((u, i) => (
                          <tr key={u.id ?? u._id ?? i}>
                            <td>
                              <span className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-white"
                                style={{ width: 30, height: 30, background: '#2E1A47', fontSize: 11 }}>
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

        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>🚀 Gestión Rápida</h5>
              <div className="d-grid gap-2">
                {[
                  { label: 'Gestión de Usuarios', desc: 'Alta, baja y edición de cuentas', icon: '👥', to: '/admin/users' },
                  { label: 'Gestión de Deportes', desc: 'Administrar disciplinas deportivas', icon: '🏅', to: '/admin/sports' },
                  { label: 'Gestión de Salas', desc: 'Administrar espacios disponibles', icon: '🏢', to: '/admin/rooms' },
                  { label: 'Gestión de Clases', desc: 'Asignar horarios, coaches y salas', icon: '📅', to: '/admin/classes' },
                ].map((item) => (
                  <button key={item.to}
                    className="btn text-start p-3 border rounded-3 bg-white"
                    style={{ transition: 'all .2s' }}
                    onClick={() => navigate(item.to)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8f5ff'; e.currentTarget.style.borderColor = '#2E1A47'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#dee2e6'; }}
                  >
                    <p className="mb-0 fw-semibold" style={{ fontSize: '14px', color: '#2E1A47' }}>
                      {item.icon} {item.label}
                    </p>
                    <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>{item.desc}</p>
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>📊 Resumen del Club</h5>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <span className="text-muted" style={{ fontSize: '13px' }}>Salas disponibles</span>
                  <span className="fw-semibold" style={{ color: '#2E1A47' }}>{totalRooms ?? '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <span className="text-muted" style={{ fontSize: '13px' }}>Asignaciones (SportRoom)</span>
                  <span className="fw-semibold" style={{ color: '#2E1A47' }}>{sportRooms?.length ?? '—'}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center py-2">
                  <span className="text-muted" style={{ fontSize: '13px' }}>Total registrados</span>
                  <span className="fw-semibold" style={{ color: '#2E1A47' }}>{usuarios?.length ?? '—'}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {schedules && schedules.length > 0 && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: '#2E1A47' }}>📅 Horarios Programados</h5>
              <Button size="sm" onClick={() => navigate('/admin/classes')}
                style={{ background: '#F2B705', border: 'none', color: '#2E1A47', fontWeight: 700, fontSize: '12px' }}>
                Ver todas
              </Button>
            </div>
            <div className="table-responsive" style={{ maxHeight: 250, overflowY: 'auto' }}>
              <Table hover className="align-middle mb-0" style={{ fontSize: '13px' }}>
                <thead style={{ background: '#f8f5ff', position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th style={{ color: '#2E1A47' }}>Día</th>
                    <th style={{ color: '#2E1A47' }}>Horario</th>
                    <th style={{ color: '#2E1A47' }}>Asignación</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((s) => {
                    const sr = s.sportRoom;
                    return (
                      <tr key={s.id}>
                        <td className="fw-semibold">{DIAS_MAP[s.day_of_week] || '—'}</td>
                        <td>{s.start_time || s.startTime || '—'} - {s.end_time || s.endTime || '—'}</td>
                        <td className="text-muted" style={{ fontSize: '12px' }}>
                          {sr ? `${sr.sport?.name || '?'}/${sr.coach?.full_name || '—'}/${sr.room?.name || '—'}` : `Asig. #${s.sport_room_id || s.sportRoomId}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {usuarios && (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>📊 Distribución por Rol</h5>
            <Row className="g-3 text-center">
              {[
                { label: 'Usuarios', valor: totalUsuarios, color: '#2E1A47', bg: '#f0ebff' },
                { label: 'Coaches', valor: totalCoaches, color: '#d9a404', bg: '#fff8e1' },
                { label: 'Administradores', valor: totalAdmins, color: '#dc3545', bg: '#fff0f0' },
              ].map(({ label, valor, color, bg }) => (
                <Col key={label} md={4}>
                  <div className="p-3 rounded-3" style={{ background: bg }}>
                    <p className="fw-bold mb-1" style={{ fontSize: '32px', color }}>{valor ?? '—'}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>{label}</p>
                    {usuarios.length > 0 && (
                      <div className="mt-2 rounded-pill overflow-hidden" style={{ height: 6, background: '#e9ecef' }}>
                        <div className="rounded-pill" style={{
                          height: '100%', width: `${Math.round(((valor || 0) / usuarios.length) * 100)}%`,
                          background: color, transition: 'width 0.6s ease',
                        }} />
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}