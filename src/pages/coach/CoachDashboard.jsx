import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { getUser } from '../../services/authService';
import { getCoachMyClasses, getCoachMySchedules } from '../../services/classService';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DIAS_MAP = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' };

export default function CoachDashboard() {
  const user = getUser();
  const nombre = user?.full_name || user?.name || 'Coach';

  const [misClases, setMisClases] = useState([]);
  const [horario, setHorario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [myClasses, mySchedules] = await Promise.all([
        getCoachMyClasses(),
        getCoachMySchedules(),
      ]);
      setMisClases(Array.isArray(myClasses) ? myClasses : []);
      setHorario(Array.isArray(mySchedules) ? mySchedules : []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el horario.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ── Helpers para horario (ClassSchedule) ──────────────────────────────────
  const getSchedNombre = (schedule) => {
    const sr = schedule.sportRoom;
    if (sr?.sport?.name) return sr.sport.name;
    return 'Clase';
  };

  const getSchedDia = (schedule) => DIAS_MAP[schedule.day_of_week] || schedule.day || '—';
  const getSchedHora = (schedule) => schedule.start_time || schedule.startTime || '—';
  const getSchedSala = (schedule) => {
    const sr = schedule.sportRoom;
    if (sr?.room?.name) return sr.room.name;
    return '—';
  };

  // ── Helpers para clases (SportRoom) ───────────────────────────────────────
  const getClaseNombre = (sr) => sr.sport?.name || sr.sport_name || '—';
  const getClaseCoach = (sr) => sr.coach?.full_name || sr.coach?.name || sr.coach_name || '—';
  const getClaseSala = (sr) => sr.room?.name || sr.room_name || '—';

  const totalHoras = horario.length;
  const diasConClase = [...new Set(horario.map((h) => DIAS_MAP[h.day_of_week] || h.day))].length;

  return (
    <div>
      {/* ── Banner ──────────────────────────────────────────────────── */}
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

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
          ⚠️ {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: '#198754' }} />
          <p className="mt-2 text-muted">Cargando tu horario y clases...</p>
        </div>
      ) : (
        <>
          {/* ── Resumen rápido ──────────────────────────────────────────── */}
          <Row className="g-3 mb-4">
            <Col sm={6} md={3}>
              <Card className="border-0 shadow-sm" style={{ borderLeft: '5px solid #198754' }}>
                <Card.Body className="d-flex align-items-center gap-3 p-3">
                  <span style={{ fontSize: '2rem' }}>📋</span>
                  <div>
                    <p className="text-muted mb-0" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
                      Clases Asignadas
                    </p>
                    <p className="fw-bold mb-0" style={{ fontSize: '24px', color: '#2E1A47' }}>{misClases.length}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card className="border-0 shadow-sm" style={{ borderLeft: '5px solid #F2B705' }}>
                <Card.Body className="d-flex align-items-center gap-3 p-3">
                  <span style={{ fontSize: '2rem' }}>🕐</span>
                  <div>
                    <p className="text-muted mb-0" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
                      Horas Semanales
                    </p>
                    <p className="fw-bold mb-0" style={{ fontSize: '24px', color: '#2E1A47' }}>{totalHoras}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card className="border-0 shadow-sm" style={{ borderLeft: '5px solid #0d6efd' }}>
                <Card.Body className="d-flex align-items-center gap-3 p-3">
                  <span style={{ fontSize: '2rem' }}>🗓️</span>
                  <div>
                    <p className="text-muted mb-0" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
                      Días con Clase
                    </p>
                    <p className="fw-bold mb-0" style={{ fontSize: '24px', color: '#2E1A47' }}>{diasConClase}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} md={3}>
              <Card className="border-0 shadow-sm" style={{ borderLeft: '5px solid #862e9c' }}>
                <Card.Body className="d-flex align-items-center gap-3 p-3">
                  <span style={{ fontSize: '2rem' }}>🏢</span>
                  <div>
                    <p className="text-muted mb-0" style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
                      Salas
                    </p>
                    <p className="fw-bold mb-0" style={{ fontSize: '24px', color: '#2E1A47' }}>
                      {new Set(horario.map((h) => getSchedSala(h)).filter(Boolean)).size}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            {/* ── FLUJO 4: Mis Clases (SportRoom del coach) ─────────────── */}
            <Col lg={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>
                    📋 Mis Clases
                  </h5>
                  {misClases.length === 0 ? (
                    <p className="text-muted text-center py-3">No tienes clases asignadas.</p>
                  ) : (
                    <div className="table-responsive">
                      <Table className="align-middle mb-0" style={{ fontSize: '13px' }}>
                        <thead style={{ background: '#f8f5ff' }}>
                          <tr>
                            <th style={{ color: '#2E1A47', fontWeight: 700 }}>Deporte</th>
                            <th style={{ color: '#2E1A47', fontWeight: 700 }}>Sala</th>
                            <th style={{ color: '#2E1A47', fontWeight: 700 }}>Estado</th>
                            <th style={{ color: '#2E1A47', fontWeight: 700 }}>Horarios</th>
                          </tr>
                        </thead>
                        <tbody>
                          {misClases.map((sr) => (
                            <tr key={sr.id}>
                              <td className="fw-semibold">{getClaseNombre(sr)}</td>
                              <td><Badge bg="light" text="dark" className="border">{getClaseSala(sr)}</Badge></td>
                              <td>
                                <Badge bg={sr.status ? 'success' : 'secondary'}>
                                  {sr.status ? 'Activa' : 'Inactiva'}
                                </Badge>
                              </td>
                              <td>
                                {sr.schedules && sr.schedules.length > 0 ? (
                                  sr.schedules.filter((s) => s.status !== false).map((s, i) => (
                                    <Badge key={i} bg="info" className="me-1" style={{ fontSize: '11px' }}>
                                      {DIAS_MAP[s.day_of_week] || s.day}: {s.start_time || s.startTime}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-muted" style={{ fontSize: '12px' }}>Sin horarios</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                  <p className="text-muted mt-2 mb-0" style={{ fontSize: '12px' }}>
                    {misClases.length} clase{misClases.length !== 1 ? 's' : ''} asignada{misClases.length !== 1 ? 's' : ''}
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* ── FLUJO 5: Mi Horario Semanal (ClassSchedule) ──────────── */}
            <Col lg={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>
                    🕐 Mi Horario Semanal
                  </h5>
                  {horario.length === 0 ? (
                    <p className="text-muted text-center py-3">No tienes horarios asignados.</p>
                  ) : (
                    <div className="table-responsive">
                      <Table className="align-middle mb-0" style={{ fontSize: '13px' }}>
                        <thead style={{ background: '#f8f5ff' }}>
                          <tr>
                            <th style={{ color: '#2E1A47', fontWeight: 700 }}>Día</th>
                            <th style={{ color: '#2E1A47', fontWeight: 700 }}>Clase</th>
                            <th style={{ color: '#2E1A47', fontWeight: 700 }}>Hora</th>
                            <th style={{ color: '#2E1A47', fontWeight: 700 }}>Salón</th>
                          </tr>
                        </thead>
                        <tbody>
                          {horario.map((s) => (
                            <tr key={s.id}>
                              <td>
                                <Badge style={{ background: '#e8e0ff', color: '#2E1A47', fontWeight: 600 }}>
                                  {getSchedDia(s)}
                                </Badge>
                              </td>
                              <td className="fw-semibold">{getSchedNombre(s)}</td>
                              <td>{getSchedHora(s)}</td>
                              <td>
                                <Badge bg="light" text="dark" className="border">{getSchedSala(s)}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* ── Vista Semanal Rápida ────────────────────────────────────── */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>📆 Vista Semanal Rápida</h5>
              <Row className="g-2 text-center">
                {DIAS_SEMANA.map((dia) => {
                  const clasesDia = horario.filter((h) => (DIAS_MAP[h.day_of_week] || h.day) === dia);
                  return (
                    <Col key={dia} xs={6} sm={4} md={2}>
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: clasesDia.length > 0 ? '#f0ebff' : '#f8f9fa',
                          border: `2px solid ${clasesDia.length > 0 ? '#2E1A47' : '#dee2e6'}`,
                          minHeight: 80,
                        }}
                      >
                        <p className="fw-bold mb-1" style={{ fontSize: '13px', color: '#2E1A47' }}>{dia}</p>
                        {clasesDia.length === 0 ? (
                          <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Libre</p>
                        ) : (
                          clasesDia.map((c, i) => (
                            <p key={i} className="mb-0" style={{ fontSize: '11px', color: '#4a2d6e' }}>
                              {getSchedNombre(c)}<br />{getSchedHora(c)}
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
        </>
      )}
    </div>
  );
}