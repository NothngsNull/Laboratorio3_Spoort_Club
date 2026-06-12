import React, { useState } from 'react';
import { Row, Col, Card, Badge, Table } from 'react-bootstrap';
import { getUser } from '../../services/authService';

// ── Datos de demostración (sin backend propio aún) ──────────────────────────
const HORARIO = [
  { dia: 'Lunes',     clase: 'Spinning',  hora: '18:00', salon: 'A1' },
  { dia: 'Miércoles', clase: 'Spinning',  hora: '10:00', salon: 'A1' },
  { dia: 'Miércoles', clase: 'CrossFit',  hora: '19:00', salon: 'B2' },
  { dia: 'Viernes',   clase: 'Boxeo',     hora: '19:00', salon: 'C3' },
  { dia: 'Sábado',    clase: 'HIIT',      hora: '09:00', salon: 'A2' },
];

const ALUMNOS_CLASE = [
  { nombre: 'Carlos Gómez',   estado: 'presente'  },
  { nombre: 'Ana Ruiz',       estado: 'pendiente' },
  { nombre: 'Martín Soto',    estado: 'presente'  },
  { nombre: 'Valeria Torres', estado: 'pendiente' },
  { nombre: 'Diego Mora',     estado: 'ausente'   },
];

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function estadoBadge(estado) {
  if (estado === 'presente')  return <Badge bg="success">Presente</Badge>;
  if (estado === 'ausente')   return <Badge bg="danger">Ausente</Badge>;
  return                             <Badge bg="warning" text="dark">Pendiente</Badge>;
}

export default function CoachDashboard() {
  const user = getUser();
  const nombre = user?.full_name || user?.name || 'Coach';

  const [alumnos, setAlumnos] = useState(ALUMNOS_CLASE);
  const [claseActiva, setClaseActiva] = useState('Spinning (18:00 — Lunes)');

  const toggleEstado = (idx) => {
    setAlumnos(prev =>
      prev.map((a, i) => {
        if (i !== idx) return a;
        const ciclo = { pendiente: 'presente', presente: 'ausente', ausente: 'pendiente' };
        return { ...a, estado: ciclo[a.estado] };
      })
    );
  };

  const presentes = alumnos.filter(a => a.estado === 'presente').length;

  return (
    <div>
      {/* ── Banner de bienvenida ─────────────────────────────────────── */}
      <div
        className="rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3"
        style={{ background: 'linear-gradient(135deg, #1a4731, #198754)', color: '#fff' }}
      >
        <div>
          <h2 className="fw-bold mb-1">Panel de Entrenador</h2>
          <p className="mb-0 opacity-75">
            Bienvenido, Coach <strong>{nombre.split(' ')[0]}</strong> — gestiona tus clases y alumnos
          </p>
        </div>
        <span style={{ fontSize: '3rem' }}>🏋️</span>
      </div>

      {/* ── Clase en curso ───────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderLeft: '5px solid #F2B705', borderLeftWidth: 5 }}>
        <Card.Body className="d-flex align-items-center justify-content-between flex-wrap gap-3 p-4">
          <div>
            <p className="text-muted mb-1" style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
              Clase en curso
            </p>
            <h5 className="fw-bold mb-0" style={{ color: '#2E1A47' }}>🎯 {claseActiva}</h5>
            <small className="text-muted">
              {presentes} de {alumnos.length} alumnos presentes
            </small>
          </div>
          <button
            className="btn btn-sm px-4 py-2 fw-bold"
            style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 8 }}
          >
            Finalizar Clase
          </button>
        </Card.Body>
      </Card>

      <Row className="g-4 mb-4">

        {/* ── Control de asistencia ─────────────────────────────────── */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>
                📋 Control de Asistencia — {claseActiva.split('(')[0].trim()}
              </h5>
              <p className="text-muted small mb-3">
                Haz clic en el estado para cambiarlo: Pendiente → Presente → Ausente
              </p>
              <div className="d-flex flex-column gap-2">
                {alumnos.map((a, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center justify-content-between p-3 rounded-3 border"
                    style={{ background: '#fafafa', cursor: 'pointer', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0ebff'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span
                        className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold text-white"
                        style={{ width: 36, height: 36, background: '#2E1A47', fontSize: 14 }}
                      >
                        {a.nombre[0]}
                      </span>
                      <span className="fw-semibold" style={{ fontSize: '14px' }}>{a.nombre}</span>
                    </div>
                    <div
                      onClick={() => toggleEstado(idx)}
                      title="Clic para cambiar estado"
                    >
                      {estadoBadge(a.estado)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2 rounded-3 text-center" style={{ background: '#f8f5ff', fontSize: '13px', color: '#2E1A47' }}>
                ✅ Presentes: <strong>{presentes}</strong> &nbsp;|&nbsp;
                ⏳ Pendientes: <strong>{alumnos.filter(a => a.estado === 'pendiente').length}</strong> &nbsp;|&nbsp;
                ❌ Ausentes: <strong>{alumnos.filter(a => a.estado === 'ausente').length}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* ── Horario semanal ───────────────────────────────────────── */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>📅 Mi Horario Semanal</h5>
              <div className="table-responsive">
                <Table className="align-middle mb-0" style={{ fontSize: '13px' }}>
                  <thead style={{ background: '#f8f5ff' }}>
                    <tr>
                      <th>Día</th>
                      <th>Clase</th>
                      <th>Hora</th>
                      <th>Salón</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HORARIO.map((h, i) => (
                      <tr
                        key={i}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setClaseActiva(`${h.clase} (${h.hora} — ${h.dia})`)}
                        title="Clic para marcar como clase activa"
                      >
                        <td>
                          <Badge
                            style={{
                              background: claseActiva.includes(h.clase) && claseActiva.includes(h.hora) ? '#2E1A47' : '#e9ecef',
                              color: claseActiva.includes(h.clase) && claseActiva.includes(h.hora) ? '#fff' : '#555'
                            }}
                          >
                            {h.dia}
                          </Badge>
                        </td>
                        <td className="fw-semibold">{h.clase}</td>
                        <td>{h.hora}</td>
                        <td>
                          <Badge bg="light" text="dark" className="border">{h.salon}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <p className="text-muted mt-3 mb-0" style={{ fontSize: '12px' }}>
                💡 Haz clic en una fila para seleccionarla como clase activa.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ── Resumen rápido por día ───────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>📆 Vista Semanal Rápida</h5>
          <Row className="g-2 text-center">
            {DIAS_SEMANA.map(dia => {
              const clasesDia = HORARIO.filter(h => h.dia === dia);
              return (
                <Col key={dia} xs={6} sm={4} md={2}>
                  <div
                    className="p-3 rounded-3"
                    style={{
                      background: clasesDia.length > 0 ? '#f0ebff' : '#f8f9fa',
                      border: `2px solid ${clasesDia.length > 0 ? '#2E1A47' : '#dee2e6'}`,
                      minHeight: 80
                    }}
                  >
                    <p className="fw-bold mb-1" style={{ fontSize: '13px', color: '#2E1A47' }}>{dia}</p>
                    {clasesDia.length === 0 ? (
                      <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Libre</p>
                    ) : (
                      clasesDia.map((c, i) => (
                        <p key={i} className="mb-0" style={{ fontSize: '11px', color: '#4a2d6e' }}>
                          {c.clase}<br />{c.hora}
                        </p>
                      ))
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}