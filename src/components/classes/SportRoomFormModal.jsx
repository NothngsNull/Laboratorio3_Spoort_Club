import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const INITIAL_FORM = {
  sport_id: "",
  room_id: "",
  coach_id: "",
  observation: "",
  status: true,
};

function SportRoomFormModal({ show, handleClose, handleSave, selected, sports, coaches, rooms }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selected) {
      setFormData({
        sport_id: selected.sport_id || selected.sportId || "",
        room_id: selected.room_id || selected.roomId || "",
        coach_id: selected.coach_id || selected.coachId || "",
        observation: selected.observation || "",
        status: selected.status ?? true,
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [selected, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.sport_id) newErrors.sport_id = "Selecciona un deporte.";
    if (!formData.room_id) newErrors.room_id = "Selecciona una sala.";
    if (!formData.coach_id) newErrors.coach_id = "Selecciona un coach.";
    return newErrors;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    handleSave(formData);
  };

  const getId = (user) => user.id ?? user._id;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        style={{ background: "linear-gradient(90deg, #2E1A47, #4a2d6e)", borderBottom: "3px solid #F2B705" }}
      >
        <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
          {selected ? "✏️ Editar Asignación" : "➕ Nueva Asignación"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit} noValidate>
        <Modal.Body style={{ background: "#fafafa" }}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Deporte <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="sport_id"
              value={formData.sport_id}
              onChange={handleChange}
              isInvalid={!!errors.sport_id}
              style={{ fontSize: "14px" }}
            >
              <option value="">-- Seleccionar deporte --</option>
              {sports.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.sport_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Coach <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="coach_id"
              value={formData.coach_id}
              onChange={handleChange}
              isInvalid={!!errors.coach_id}
              style={{ fontSize: "14px" }}
            >
              <option value="">-- Seleccionar coach --</option>
              {coaches.map((c) => (
                <option key={getId(c)} value={getId(c)}>{c.full_name || c.name}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.coach_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Sala <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              isInvalid={!!errors.room_id}
              style={{ fontSize: "14px" }}
            >
              <option value="">-- Seleccionar sala --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name} ({r.capacity} personas)</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.room_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Observación
            </Form.Label>
            <Form.Control
              type="text"
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              placeholder="Ej: Clase avanzada, requiere equipamiento"
              style={{ fontSize: "14px" }}
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Check
              type="switch"
              id="sr-status-switch"
              name="status"
              label={formData.status ? "Estado: Activo" : "Estado: Inactivo"}
              checked={formData.status}
              onChange={handleChange}
              style={{ fontSize: "14px", color: "#2E1A47", fontWeight: 600 }}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer style={{ background: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}>
          <Button variant="secondary" onClick={handleClose} style={{ fontSize: "14px" }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            style={{
              background: "#F2B705",
              border: "none",
              color: "#2E1A47",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            {selected ? "Guardar Cambios" : "Crear Asignación"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SportRoomFormModal;