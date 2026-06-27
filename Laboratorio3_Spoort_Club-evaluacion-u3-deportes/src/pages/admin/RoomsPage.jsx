import { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, Table, Button,
  Badge, Form, Spinner, Alert
} from "react-bootstrap";
import Swal from "sweetalert2";
import RoomFormModal from "../../components/rooms/RoomFormModal.jsx";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../services/roomService.js";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const cargarSalas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError(err.message || "Error al cargar las salas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSalas();
  }, []);

  const handleNuevo = () => {
    setSelectedRoom(null);
    setShowModal(true);
  };

  const handleEditar = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleCerrar = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const handleGuardar = async (formData) => {
    try {
      if (selectedRoom) {
        const resp = await updateRoom(selectedRoom.id, formData);
        const respData = resp.data || resp;
        setRooms((prev) =>
          prev.map((r) => (r.id === selectedRoom.id ? { ...r, ...respData } : r))
        );
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "La sala fue actualizada correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        const resp = await createRoom(formData);
        const respData = resp.data || resp;
        setRooms((prev) => [...prev, respData]);
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: "La sala fue creada correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      handleCerrar();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo guardar la sala.",
      });
    }
  };

  const handleEliminar = async (room) => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar esta sala?",
      text: `"${room.name}" será eliminada permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteRoom(room.id);
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
      Swal.fire({
        icon: "success",
        title: "Eliminada",
        text: "La sala fue eliminada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo eliminar la sala.",
      });
    }
  };

  return (
    <Container fluid className="py-4 px-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold mb-0" style={{ color: "#2E1A47" }}>
            🏢 Gestión de Salas
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            Administra las salas disponibles en SportClub
          </p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={cargarSalas}
            disabled={loading}
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            {loading ? (
              <><Spinner animation="border" size="sm" className="me-1" /> Cargando…</>
            ) : (
              "🔄 Refrescar"
            )}
          </Button>
          <Button
            onClick={handleNuevo}
            style={{
              background: "#F2B705",
              border: "none",
              color: "#2E1A47",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            ➕ Nueva Sala
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          ⚠️ {error}
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {loading && rooms.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#2E1A47" }} />
              <p className="mt-2 text-muted">Cargando salas…</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No hay salas registradas aún.</p>
              <Button
                onClick={handleNuevo}
                style={{
                  background: "#F2B705",
                  border: "none",
                  color: "#2E1A47",
                  fontWeight: 700,
                }}
              >
                ➕ Crear primera sala
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0" style={{ fontSize: "14px" }}>
                <thead style={{ background: "#f8f5ff" }}>
                  <tr>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>#</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Nombre</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Capacidad</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Ubicación</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Estado</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, index) => (
                    <tr key={room.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td className="fw-semibold">{room.name}</td>
                      <td>
                        <Badge style={{ background: "#e8e0ff", color: "#2E1A47", fontWeight: 600 }}>
                          {room.capacity} personas
                        </Badge>
                      </td>
                      <td className="text-muted">{room.location || "—"}</td>
                      <td>
                        <Form.Check
                          type="switch"
                          id={`room-switch-${room.id}`}
                          checked={room.status}
                          readOnly
                          label={
                            <span style={{ color: room.status ? "#198754" : "#dc3545", fontWeight: 600, fontSize: "13px" }}>
                              {room.status ? "Activo" : "Inactivo"}
                            </span>
                          }
                        />
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditar(room)}
                            style={{
                              background: "#2E1A47",
                              border: "none",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          >
                            ✏️ Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleEliminar(room)}
                            style={{ fontSize: "12px", fontWeight: 600 }}
                          >
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

      <RoomFormModal
        show={showModal}
        handleClose={handleCerrar}
        handleSave={handleGuardar}
        selectedRoom={selectedRoom}
      />
    </Container>
  );
}

export default RoomsPage;