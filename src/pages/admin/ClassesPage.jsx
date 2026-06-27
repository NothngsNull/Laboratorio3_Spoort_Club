import { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, Table, Button,
  Badge, Form, Spinner, Alert, Nav
} from "react-bootstrap";
import Swal from "sweetalert2";
import SportRoomFormModal from "../../components/classes/SportRoomFormModal.jsx";
import ScheduleFormModal from "../../components/classes/ScheduleFormModal.jsx";
import {
  getSportRooms, createSportRoom, updateSportRoom, deleteSportRoom,
  getSchedules, createSchedule, updateSchedule, deleteSchedule,
} from "../../services/classService.js";
import { getSports } from "../../services/sportService.js";
import { getUsers } from "../../services/userService.js";
import { getRooms } from "../../services/roomService.js";

const DIAS_MAP = { 1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 7: "Domingo" };

function ClassesPage() {
  const [tab, setTab] = useState("schedules");

  const [sportRooms, setSportRooms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [sports, setSports] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showSRModal, setShowSRModal] = useState(false);
  const [selectedSR, setSelectedSR] = useState(null);
  const [showSchModal, setShowSchModal] = useState(false);
  const [selectedSch, setSelectedSch] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [srData, schData, sportsData, usersData, roomsData] = await Promise.all([
        getSportRooms(),
        getSchedules(),
        getSports(),
        getUsers(),
        getRooms(),
      ]);
      setSportRooms(Array.isArray(srData) ? srData : []);
      setSchedules(Array.isArray(schData) ? schData : []);
      setSports(Array.isArray(sportsData) ? sportsData : []);
      setCoaches(usersData.filter((u) => u.role === "coach"));
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (err) {
      setError(err.message || "Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ── Sport Room handlers ────────────────────────────────────────────────────
  const handleNewSR = () => { setSelectedSR(null); setShowSRModal(true); };
  const handleEditSR = (sr) => { setSelectedSR(sr); setShowSRModal(true); };
  const handleCloseSR = () => { setShowSRModal(false); setSelectedSR(null); };

  const handleSaveSR = async (formData) => {
    try {
      if (selectedSR) {
        await updateSportRoom(selectedSR.id, formData);
        Swal.fire({ icon: "success", title: "¡Actualizado!", text: "Asignación actualizada.", timer: 2000, showConfirmButton: false });
      } else {
        await createSportRoom(formData);
        Swal.fire({ icon: "success", title: "¡Creado!", text: "Asignación creada.", timer: 2000, showConfirmButton: false });
      }
      handleCloseSR();
      cargarDatos();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message || "No se pudo guardar." });
    }
  };

  const handleDeleteSR = async (sr) => {
    const result = await Swal.fire({
      title: "¿Eliminar asignación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#dc3545", cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteSportRoom(sr.id);
      setSportRooms((prev) => prev.filter((s) => s.id !== sr.id));
      Swal.fire({ icon: "success", title: "Eliminada", text: "Asignación eliminada.", timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message || "No se pudo eliminar." });
    }
  };

  // ── Schedule handlers ─────────────────────────────────────────────────────
  const handleNewSch = () => { setSelectedSch(null); setShowSchModal(true); };
  const handleEditSch = (sch) => { setSelectedSch(sch); setShowSchModal(true); };
  const handleCloseSch = () => { setShowSchModal(false); setSelectedSch(null); };

  const handleSaveSch = async (formData) => {
    try {
      if (selectedSch) {
        await updateSchedule(selectedSch.id, formData);
        Swal.fire({ icon: "success", title: "¡Actualizado!", text: "Horario actualizado.", timer: 2000, showConfirmButton: false });
      } else {
        await createSchedule(formData);
        Swal.fire({ icon: "success", title: "¡Creado!", text: "Horario creado.", timer: 2000, showConfirmButton: false });
      }
      handleCloseSch();
      cargarDatos();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message || "No se pudo guardar." });
    }
  };

  const handleDeleteSch = async (sch) => {
    const result = await Swal.fire({
      title: "¿Eliminar horario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#dc3545", cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteSchedule(sch.id);
      setSchedules((prev) => prev.filter((s) => s.id !== sch.id));
      Swal.fire({ icon: "success", title: "Eliminado", text: "Horario eliminado.", timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message || "No se pudo eliminar." });
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getSportName = (sr) => sr.sport?.name || sr.sport_name || "—";
  const getCoachName = (sr) => sr.coach?.full_name || sr.coach?.name || sr.coach_name || "—";
  const getRoomName = (sr) => sr.room?.name || sr.room_name || "—";
  const getSchSportRoomLabel = (sch) => {
    const sr = sch.sportRoom;
    if (!sr) return `Asig. #${sch.sport_room_id || sch.sportRoomId}`;
    return `${sr.sport?.name || "?"} | ${sr.coach?.full_name || "?"} | ${sr.room?.name || "?"}`;
  };

  return (
    <Container fluid className="py-4 px-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold mb-0" style={{ color: "#2E1A47" }}>📅 Gestión de Clases</h2>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            Administra asignaciones (deporte+coach+sala) y horarios
          </p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-secondary"
            onClick={cargarDatos} disabled={loading}
            style={{ fontSize: "14px", fontWeight: 600 }}>
            {loading ? <><Spinner animation="border" size="sm" className="me-1" /> Cargando…</> : "🔄 Refrescar"}
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          ⚠️ {error}
        </Alert>
      )}

      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link active={tab === "schedules"} onClick={() => setTab("schedules")}
            style={{ color: tab === "schedules" ? "#2E1A47" : "#6c757d", fontWeight: 700, fontSize: "14px" }}>
            🕐 Horarios
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={tab === "sportrooms"} onClick={() => setTab("sportrooms")}
            style={{ color: tab === "sportrooms" ? "#2E1A47" : "#6c757d", fontWeight: 700, fontSize: "14px" }}>
            🏷️ Asignaciones
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: "#2E1A47" }} />
          <p className="mt-2 text-muted">Cargando datos…</p>
        </div>
      ) : (
        <>
          {/* ── TAB 1: Horarios ─────────────────────────────────────────────── */}
          {tab === "schedules" && (
            <>
              <div className="d-flex justify-content-end mb-3">
                <Button onClick={handleNewSch}
                  style={{ background: "#F2B705", border: "none", color: "#2E1A47", fontWeight: 700, fontSize: "14px" }}>
                  ➕ Nuevo Horario
                </Button>
              </div>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  {schedules.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">No hay horarios programados aún.</p>
                      <Button onClick={handleNewSch}
                        style={{ background: "#F2B705", border: "none", color: "#2E1A47", fontWeight: 700 }}>
                        ➕ Programar primer horario
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="align-middle mb-0" style={{ fontSize: "14px" }}>
                        <thead style={{ background: "#f8f5ff" }}>
                          <tr>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>#</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Asignación</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Día</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Inicio</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Fin</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Estado</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedules.map((s, i) => (
                            <tr key={s.id}>
                              <td className="text-muted">{i + 1}</td>
                              <td className="fw-semibold" style={{ fontSize: "12px" }}>{getSchSportRoomLabel(s)}</td>
                              <td>{DIAS_MAP[s.day_of_week || s.dayOfWeek] || "—"}</td>
                              <td>{s.start_time || s.startTime || "—"}</td>
                              <td>{s.end_time || s.endTime || "—"}</td>
                              <td>
                                <Badge bg={s.status ? "success" : "secondary"}>
                                  {s.status ? "Activo" : "Inactivo"}
                                </Badge>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button size="sm" onClick={() => handleEditSch(s)}
                                    style={{ background: "#2E1A47", border: "none", color: "#fff", fontWeight: 600, fontSize: "12px" }}>
                                    ✏️ Editar
                                  </Button>
                                  <Button size="sm" variant="outline-danger" onClick={() => handleDeleteSch(s)}
                                    style={{ fontSize: "12px", fontWeight: 600 }}>
                                    🗑️ Eliminar
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}

          {/* ── TAB 2: Asignaciones ─────────────────────────────────────────── */}
          {tab === "sportrooms" && (
            <>
              <div className="d-flex justify-content-end mb-3">
                <Button onClick={handleNewSR}
                  style={{ background: "#F2B705", border: "none", color: "#2E1A47", fontWeight: 700, fontSize: "14px" }}>
                  ➕ Nueva Asignación
                </Button>
              </div>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  {sportRooms.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">No hay asignaciones creadas aún.</p>
                      <Button onClick={handleNewSR}
                        style={{ background: "#F2B705", border: "none", color: "#2E1A47", fontWeight: 700 }}>
                        ➕ Crear primera asignación
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover className="align-middle mb-0" style={{ fontSize: "14px" }}>
                        <thead style={{ background: "#f8f5ff" }}>
                          <tr>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>#</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Deporte</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Coach</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Sala</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Estado</th>
                            <th style={{ color: "#2E1A47", fontWeight: 700 }}>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sportRooms.map((sr, i) => (
                            <tr key={sr.id}>
                              <td className="text-muted">{i + 1}</td>
                              <td className="fw-semibold">{getSportName(sr)}</td>
                              <td className="text-muted">{getCoachName(sr)}</td>
                              <td><Badge style={{ background: "#e8e0ff", color: "#2E1A47", fontWeight: 600 }}>{getRoomName(sr)}</Badge></td>
                              <td>
                                <Badge bg={sr.status ? "success" : "secondary"}>
                                  {sr.status ? "Activo" : "Inactivo"}
                                </Badge>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button size="sm" onClick={() => handleEditSR(sr)}
                                    style={{ background: "#2E1A47", border: "none", color: "#fff", fontWeight: 600, fontSize: "12px" }}>
                                    ✏️ Editar
                                  </Button>
                                  <Button size="sm" variant="outline-danger" onClick={() => handleDeleteSR(sr)}
                                    style={{ fontSize: "12px", fontWeight: 600 }}>
                                    🗑️ Eliminar
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </>
      )}

      <SportRoomFormModal show={showSRModal} handleClose={handleCloseSR} handleSave={handleSaveSR}
        selected={selectedSR} sports={sports} coaches={coaches} rooms={rooms} />
      <ScheduleFormModal show={showSchModal} handleClose={handleCloseSch} handleSave={handleSaveSch}
        selected={selectedSch} sportRooms={sportRooms} />
    </Container>
  );
}

export default ClassesPage;