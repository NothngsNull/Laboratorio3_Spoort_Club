import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, ProgressBar, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getUser } from '../../services/authService';
import { getAvailableClasses, getMyReservations, createReservation, cancelReservation } from '../../services/reservationService';
import Swal from 'sweetalert2';

const DIAS_MAP = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' };

export default function UserDashboard() {
  const user = getUser();
  const nombre = user?.full_name || user?.name || 'Deportista';
  const email = (user?.email || '').toLowerCase();

  const [sesiones] = useState(6);
  const totalSesiones = 10;
  const porcentaje = Math.round((sesiones / totalSesiones) * 100);

  const [clasesDisponibles, setClasesDisponibles] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notif, setNotif] = useState('');

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [disponibles, misReservas] = await Promise.all([
        getAvailableClasses(),
        getMyReservations(),
      ]);
      // member/classes devuelve SportRoom con sport, room, coach, schedules
      setClasesDisponibles(Array.isArray(disponibles) ? disponibles : []);
      setReservas(Array.isArray(misReservas) ? misReservas : []);
    } catch (err) {
      setError(err.message || 'Error al cargar las clases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const reservasActivas = reservas.filter((r) => r.status === "active");

  const reservarClase = async (schedule) => {
    const scheduleId = schedule.id;
    const yaReservada = reservasActivas.some((r) => {
      const rSchId = r.class_schedule_id || r.classSchedule?.id || r.classScheduleId;
      return rSchId === scheduleId;
    });
    if (yaReservada) {
      setNotif(`Ya tienes reserva en ese horario.`);
      setTimeout(() => setNotif(''), 3000);
      return;
    }
    try {
      await createReservation(scheduleId);
      await cargarDatos();
      setNotif(`✅ Reserva confirmada.`);
      setTimeout(() => setNotif(''), 3000);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'No se pudo hacer la reserva.',
      });
    }
  };

  const cancelarReserva = async (reserva) => {
    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    });

    if (!result.isConfirmed) return;

    try {
      await cancelReservation(reserva.id);
      await cargarDatos();
      setNotif('Reserva cancelada correctamente.');
      setTimeout(() => setNotif(''), 3000);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'No se pudo cancelar la reserva.',
      });
    }
  };

  // ── Helpers for SportRoom display ──────────────────────────────────────────
  const getClaseNombre = (sr) => {
    if (sr.sport?.name) return sr.sport.name;
    if (sr.sport_name) return sr.sport_name;
    return '—';
  };

  const getCoachNombre = (sr) => {
    if (sr.coach?.full_name) return sr.coach.full_name;
    if (sr.coach?.name) return sr.coach.name;
    if (sr.coach_name) return sr.coach_name;
    return '—';
  };

  // member/classes devuelve SportRoom with schedules array
  const getSchedulesFromSportRoom = (sr) => {
    if (sr.schedules && Array.isArray(sr.schedules)) return sr.schedules;
    return [];
  };

  // Flatten schedules with sportRoom info
  const flatSchedules = clasesDisponibles.flatMap((sr) => {
    const schedules = getSchedulesFromSportRoom(sr);
    return schedules
      .filter((s) => s.status !== false)
      .map((s) => ({
        ...s,
        _sportRoom: sr,
      }));
  });

  // ── Helpers for my reservations ────────────────────────────────────────────
  const getReservaNombre = (r) => {
    const sch = r.classSchedule;
    if (sch?.sportRoom?.sport?.name) return sch.sportRoom.sport.name;
    if (sch?.sport_name) return sch.sport_name;
    return 'Clase';
  };

  const getReservaDia = (r) => {
    const sch = r.classSchedule;
    if (sch?.day_of_week) return DIAS_MAP[sch.day_of_week] || '—';
    if (sch?.day) return sch.day;
    return '—';
  };

  const getReservaHora = (r) => {
    const sch = r.classSchedule;
    if (sch?.start_time) return sch.start_time;
    if (sch?.startTime) return sch.startTime;
    return '—';
  };

  const getCupos = (sch) => {
    if (sch.available_spots !== undefined) return sch.available_spots;
    if (sch.capacity !== undefined && sch.reserved !== undefined) return sch.capacity - sch.reserved;
    return 0;
  };

  const scheduleIdFromSch = (s) => s.id;

  return (
    <div>
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

      {notif && (
        <div
          className="mb-3 px-3 py-2 rounded-3 text-center fw-semibold"
          style={{ background: '#eafaf1', border: '1px solid #a9dfbf', color: '#1e6b3a', fontSize: '14px' }}
        >
          {notif}
        </div>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-3">
          ⚠️ {error}
        </Alert>
      )}

      <Row className="g-4 mb-4">
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

        <Col md={8}>
          <Row className="g-4 h-100">
            <Col xs={12}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0" style={{ color: '#2E1A47' }}>📈 Tu Progreso General</h5>
                    <Badge style={{ background: '#F2B705', color: '#2E1A47', fontWeight: 700 }}>
                      {sesiones} / {totalSesiones} sesiones
                    </Badge>
                  </div>
                  <ProgressBar now={porcentaje} label={`${porcentaje}%`}
                    style={{ height: 20, borderRadius: 10, background: '#e9ecef' }} variant="success" className="mb-2" />
                  <small className="text-muted">
                    Llevas {sesiones} de {totalSesiones} sesiones completadas este mes.
                    {porcentaje >= 80 ? ' 🔥 ¡Excelente racha!' : ' ¡Sigue así!'}
                  </small>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>📌 Mis Reservas Próximas</h5>
                  {reservasActivas.length === 0 ? (
                    <p className="text-muted small text-center py-2">No tienes reservas activas.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {reservasActivas.map((r) => (
                        <div key={r.id}
                          className="d-flex align-items-center justify-content-between p-2 rounded-3"
                          style={{ background: '#f8f5ff', border: '1px solid #e0d5f5' }}>
                          <div className="d-flex align-items-center gap-2">
                            <span className="rounded-2 d-inline-flex align-items-center justify-content-center"
                              style={{ width: 8, height: 8, background: '#2E1A47', borderRadius: '50%' }} />
                            <span className="fw-semibold" style={{ fontSize: '13px' }}>{getReservaNombre(r)}</span>
                            <span className="text-muted" style={{ fontSize: '12px' }}>
                              — {getReservaDia(r)} {getReservaHora(r)}
                            </span>
                          </div>
                          <button onClick={() => cancelarReserva(r)}
                            className="btn btn-sm btn-outline-danger py-0 px-2" style={{ fontSize: '11px' }}>
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

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h5 className="fw-bold mb-3" style={{ color: '#2E1A47' }}>🗓️ Horario Completo — Clases Disponibles</h5>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" style={{ color: '#2E1A47' }} />
              <p className="mt-2 text-muted">Cargando clases disponibles...</p>
            </div>
          ) : flatSchedules.length === 0 ? (
            <p className="text-muted text-center py-3">No hay clases disponibles en este momento.</p>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0" style={{ fontSize: '14px' }}>
                <thead style={{ background: '#f8f5ff' }}>
                  <tr>
                    <th>Clase</th>
                    <th>Entrenador</th>
                    <th>Día</th>
                    <th>Horario</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {flatSchedules.map((s) => {
                    const sr = s._sportRoom;
                    const schId = scheduleIdFromSch(s);
                    const reservada = reservasActivas.some((r) => {
                      const rSchId = r.class_schedule_id || r.classSchedule?.id || r.classScheduleId;
                      return rSchId === schId;
                    });
                    return (
                      <tr key={schId}>
                        <td className="fw-semibold">{getClaseNombre(sr)}</td>
                        <td className="text-muted">{getCoachNombre(sr)}</td>
                        <td>{DIAS_MAP[s.day_of_week] || s.day || '—'}</td>
                        <td>{s.start_time || s.startTime || '—'} - {s.end_time || s.endTime || '—'}</td>
                        <td>
                          <Button size="sm" onClick={() => reservarClase(s)} disabled={!!reservada}
                            style={{
                              background: reservada ? '#dee2e6' : '#F2B705',
                              border: 'none', color: reservada ? '#888' : '#2E1A47',
                              fontWeight: 700, fontSize: '12px',
                            }}>
                            {reservada ? '✅ Reservada' : 'Reservar'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}