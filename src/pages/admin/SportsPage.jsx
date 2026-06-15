// src/pages/admin/SportsPage.jsx
import { useEffect, useState, useCallback } from "react";
import {
  Container, Row, Col, Card, Table, Button,
  Badge, Form, Spinner, Alert
} from "react-bootstrap";
import Swal from "sweetalert2";
import SportFormModal from "../../components/sports/SportFormModal.jsx";
import {
  getSports,
  createSport,
  updateSport,
  deleteSport,
  toggleSportStatus,
} from "../../services/sportService.js";

// ── Helper: formatea fecha en "DD de Mes de YYYY" ────────────────────────────
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function formatearFecha(isoString) {
  if (!isoString) return "—";
  const fecha = new Date(isoString);
  const dia   = String(fecha.getDate()).padStart(2, "0");
  const mes   = MESES[fecha.getMonth()];
  const anio  = fecha.getFullYear();
  return `${dia} de ${mes} de ${anio}`;
}

// ─────────────────────────────────────────────────────────────────────────────

function SportsPage() {
  const [sports,        setSports]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [showModal,     setShowModal]     = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);

  // ── Carga de deportes ─────────────────────────────────────────────────────
  const cargarDeportes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSports();
      setSports(data);
    } catch (err) {
      setError(err.message || "Error al cargar los deportes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDeportes();
  }, [cargarDeportes]);

  // ── Abrir modal para crear ────────────────────────────────────────────────
  const handleNuevo = () => {
    setSelectedSport(null);
    setShowModal(true);
  };

  // ── Abrir modal para editar ───────────────────────────────────────────────
  const handleEditar = (sport) => {
    setSelectedSport(sport);
    setShowModal(true);
  };

  // ── Cerrar modal ──────────────────────────────────────────────────────────
  const handleCerrar = () => {
    setShowModal(false);
    setSelectedSport(null);
  };

  // ── Guardar (crear o editar) ──────────────────────────────────────────────
  const handleGuardar = async (formData) => {
    try {
      if (selectedSport) {
        // EDITAR
        const resp = await updateSport(selectedSport.id, formData);
        const updated = resp.data || resp;
        setSports((prev) =>
          prev.map((s) => (s.id === selectedSport.id ? { ...s, ...updated } : s))
        );
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "El deporte fue actualizado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // CREAR
        const resp = await createSport(formData);
        const nuevo = resp.data || resp;
        setSports((prev) => [...prev, nuevo]);
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: "El deporte fue creado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      handleCerrar();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo guardar el deporte.",
      });
    }
  };

  // ── Eliminar con SweetAlert2 ──────────────────────────────────────────────
  const handleEliminar = async (sport) => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar este deporte?",
      text: `"${sport.name}" será eliminado permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSport(sport.id);
      setSports((prev) => prev.filter((s) => s.id !== sport.id));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El deporte fue eliminado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo eliminar el deporte.",
      });
    }
  };

  // ── Cambiar estado con Switch ─────────────────────────────────────────────
  const handleToggleEstado = async (sport) => {
    const nuevoEstado = !sport.status;
    // Actualiza optimistamente en UI
    setSports((prev) =>
      prev.map((s) => (s.id === sport.id ? { ...s, status: nuevoEstado } : s))
    );
    try {
      await toggleSportStatus(sport.id, nuevoEstado);
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `"${sport.name}" ahora está ${nuevoEstado ? "Activo" : "Inactivo"}.`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      // Revierte si falla
      setSports((prev) =>
        prev.map((s) => (s.id === sport.id ? { ...s, status: sport.status } : s))
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo cambiar el estado.",
      });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Container fluid className="py-4 px-4">

      {/* ── Encabezado ───────────────────────────────────────────────────── */}
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold mb-0" style={{ color: "#2E1A47" }}>
            🏅 Gestión de Deportes
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            Administra los deportes ofrecidos por SportClub
          </p>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          {/* Botón Refrescar */}
          <Button
            variant="outline-secondary"
            onClick={cargarDeportes}
            disabled={loading}
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            {loading ? (
              <><Spinner animation="border" size="sm" className="me-1" /> Cargando…</>
            ) : (
              "🔄 Refrescar"
            )}
          </Button>
          {/* Botón Nuevo Deporte */}
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
            ➕ Nuevo Deporte
          </Button>
        </Col>
      </Row>

      {/* ── Alerta de error ───────────────────────────────────────────────── */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          ⚠️ {error}
        </Alert>
      )}

      {/* ── Tabla de deportes ─────────────────────────────────────────────── */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {loading && sports.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#2E1A47" }} />
              <p className="mt-2 text-muted">Cargando deportes…</p>
            </div>
          ) : sports.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No hay deportes registrados aún.</p>
              <Button
                onClick={handleNuevo}
                style={{
                  background: "#F2B705",
                  border: "none",
                  color: "#2E1A47",
                  fontWeight: 700,
                }}
              >
                ➕ Crear primer deporte
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0" style={{ fontSize: "14px" }}>
                <thead style={{ background: "#f8f5ff" }}>
                  <tr>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>#</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Nombre</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Objetivo</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Duración</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Estado</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Fecha Creación</th>
                    <th style={{ color: "#2E1A47", fontWeight: 700 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sports.map((sport, index) => (
                    <tr key={sport.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td className="fw-semibold">{sport.name}</td>
                      <td style={{ maxWidth: "280px" }}>
                        <span
                          className="text-muted"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {sport.objective}
                        </span>
                      </td>
                      <td>
                        <Badge
                          style={{ background: "#e8e0ff", color: "#2E1A47", fontWeight: 600 }}
                        >
                          {sport.duration} min
                        </Badge>
                      </td>
                      <td>
                        {/* Switch React-Bootstrap para cambiar estado */}
                        <Form.Check
                          type="switch"
                          id={`switch-${sport.id}`}
                          checked={sport.status}
                          onChange={() => handleToggleEstado(sport)}
                          label={
                            <span style={{ color: sport.status ? "#198754" : "#dc3545", fontWeight: 600, fontSize: "13px" }}>
                              {sport.status ? "Activo" : "Inactivo"}
                            </span>
                          }
                        />
                      </td>
                      <td className="text-muted" style={{ fontSize: "13px" }}>
                        {formatearFecha(sport.created_at)}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditar(sport)}
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
                            onClick={() => handleEliminar(sport)}
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

      {/* ── Modal crear / editar ──────────────────────────────────────────── */}
      <SportFormModal
        show={showModal}
        handleClose={handleCerrar}
        handleSave={handleGuardar}
        selectedSport={selectedSport}
      />

    </Container>
  );
}

export default SportsPage;
