import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { getToken, getUser } from '../../services/authService';

// ── Paleta corporativa ──────────────────────────────────────────────────────
const API = 'http://localhost:3000/api';

function StatCard({ titulo, valor, icono, color }) {
  return (
    <Card
      className="border-0 shadow-sm h-100"
      style={{ borderLeft: `5px solid ${color}` }}
    >
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

function rolBadge(rol) {
  if (rol === 'admin')  return <Badge bg="danger">Admin</Badge>;
  if (rol === 'coach')  return <Badge bg="success">Coach</Badge>;
  return                       <Badge bg="primary">Usuario</Badge>;
}

export default function AdminDashboard() {
  const token   = getToken();
  const adminMe = getUser();

  const [usuarios,    setUsuarios]    = useState(null);
  const [error,       setError]       = useState('');

  // ── Carga usuarios desde la API ─────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const lista = data.data || data.users || data || [];
        setUsuarios(Array.isArray(lista) ? lista : []);
      })
      .catch(() => setError('No se pudo conectar con el servidor (puerto 3000).'));
  }, [token]);

  // ── Derivados ────────────────────────────────────────────────────────────
  const totalUsuarios = usuarios ? usuarios.filter(u => u.role === 'user').length  : null;
  const totalCoaches  = usuarios ? usuarios.filter(u => u.role === 'coach').length : null;
  const totalAdmins   = usuarios ? usuarios.filter(u => u.role === 'admin').length : null;
  const preview       = usuarios ? usuarios.slice(0, 5) : [];

  return (
    <div>
      {/* ── Bienvenida ─────────────────────────────────────────────────── */}
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
          <StatCard titulo="Usuarios Activos"  valor={totalUsuarios} icono="👥" color="#2E1A47" />
        </Col>
        <Col sm={6} lg={3}>
          <StatCard titulo="Coaches"           valor={totalCoaches}  icono="🏋️" color="#F2B705" />
        </Col>
        <Col sm={6} lg={3}>
          <StatCard titulo="Administradores"   valor={totalAdmins}   icono="🛡️" color="#dc3545" />
        </Col>
        <Col sm={6} lg={3}>
          <StatCard titulo="Total Registrados" valor={usuarios?.length ?? null} icono="📊" color="#198754" />
        </Col>
      </Row>

      {/* ── Fila principal ───────────────────────────────────────────── */}
      <Row className="g-4 mb-4">

        {/* Tabla de usuarios */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#2E1A47' }}>
                  👥 Usuarios Registrados
                </h5>
                <small className="text-muted">Mostrando los últimos 5</small>
              </div>

              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

              {!usuarios && !error && (
                <div className="text-center py-4">
                  <Spinner animation="border" style={{ color: '#2E1A47' }} />
                  <p className="text-muted mt-2 small">Cargando usuarios...</p>
                </div>
              )}

              {usuarios && (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0" style={{ fontSize: '14px' }}>
                    <thead style={{ background: '#f8f5ff' }}>
                      <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center text-muted py-4">
                            No hay usuarios registrados.
                          </td>
                        </tr>
                      ) : (
                        preview.map((u, i) => (
                          <tr key={u.id || u._id || i}>
                            <td>
                              <span
                                className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-white"
                                style={{ width: 32, height: 32, background: '#2E1A47', fontSize: 12 }}
                              >
                                {(u.full_name || u.name || '?')[0].toUpperCase()}
                              </span>
                            </td>
                            <td className="fw-semibold">{u.full_name || u.name || '—'}</td>
                            <td className="text-muted">{(u.email || '—').toLowerCase()}</td>
                            <td>{rolBadge(u.role)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                  {usuarios.length > 5 && (
                    <p className="text-center mt-2 mb-0" style={{ fontSize: '13px', color: '#2E1A47', fontWeight: 600 }}>
                      Total de usuarios: {usuarios.length}
                    </p>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Columna derecha: accesos rápidos */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>🚀 Gestión Rápida</h5>
              <div className="d-grid gap-2">
                {[
                  { label: '👥 Gestión de Usuarios',  desc: 'Alta, baja y edición de cuentas'     },
                  { label: '🏋️ Gestión de Coaches',   desc: 'Staff técnico del club'              },
                  { label: '📋 Clases y Horarios',     desc: 'Configuración de la parrilla semanal' },
                  { label: '🏅 Disciplinas',           desc: 'Catálogo de deportes disponibles'   },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="btn text-start p-3 border rounded-3 bg-white"
                    style={{ transition: 'all .2s' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f8f5ff';
                      e.currentTarget.style.borderColor = '#2E1A47';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#dee2e6';
                    }}
                  >
                    <p className="mb-0 fw-semibold" style={{ fontSize: '14px', color: '#2E1A47' }}>{item.label}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>{item.desc}</p>
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>📄 Reportes</h5>
              {[
                { label: 'Informe Mensual',    sub: 'Resumen general del mes'     },
                { label: 'Informe Trimestral', sub: 'Actividad últimos 3 meses'   },
              ].map((r) => (
                <div
                  key={r.label}
                  className="d-flex justify-content-between align-items-center py-2 border-bottom"
                >
                  <div>
                    <p className="mb-0 fw-semibold" style={{ fontSize: '14px' }}>{r.label}</p>
                    <p className="mb-0 text-muted"  style={{ fontSize: '12px' }}>{r.sub}</p>
                  </div>
                  <Button
                    size="sm"
                    style={{ background: '#F2B705', border: 'none', color: '#2E1A47', fontWeight: 700, fontSize: '12px' }}
                  >
                    Descargar
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ── Distribución de roles (visual simple) ───────────────────── */}
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
                            transition: 'width 0.6s ease'
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
    </div>
  );
}