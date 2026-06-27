import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const DIAS_SEMANA = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

const INITIAL_FORM = {
  sport_room_id: "",
  day_of_week: 1,
  start_time: "",
  end_time: "",
  status: true,
};

function ScheduleFormModal({ show, handleClose, handleSave, selected, sportRooms }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selected) {
      setFormData({
        sport_room_id: selected.sport_room_id || selected.sportRoomId || "",
        day_of_week: selected.day_of_week || selected.dayOfWeek || 1,
        start_time: selected.start_time || selected.startTime || "",
        end_time: selected.end_time || selected.endTime || "",
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
      [name]: type === "checkbox" ? checked : type === "select-one" && name === "day_of_week" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.sport_room_id) newErrors.sport_room_id = "Selecciona una asignación.";
    if (!formData.start_time) newErrors.start_time = "La hora de inicio es obligatoria.";
    if (!formData.end_time) newErrors.end_time = "La hora de fin es obligatoria.";
    return newErrors;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    handleSave({
      sport_room_id: formData.sport_room_id,
      day_of_week: Number(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: formData.status,
    });
  };

  const getSportRoomLabel = (sr) => {
    const sport = sr.sport?.name || sr.sport_name || `ID ${sr.id}`;
    const coach = sr.coach?.full_name || sr.coach?.name || sr.coach_name || "—";
    const room = sr.room?.name || sr.room_name || "—";
    return `${sport} | ${coach} | ${room}`;
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header
        closeButton
        style={{ background: "linear-gradient(90deg, #2E1A47, #4a2d6e)", borderBottom: "3px solid #F2B705" }}
      >
        <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
          {selected ? "✏️ Editar Horario" : "➕ Nuevo Horario"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit} noValidate>
        <Modal.Body style={{ background: "#fafafa" }}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Asignación (Deporte | Coach | Sala) <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="sport_room_id"
              value={formData.sport_room_id}
              onChange={handleChange}
              isInvalid={!!errors.sport_room_id}
              style={{ fontSize: "14px" }}
            >
              <option value="">-- Seleccionar asignación --</option>
              {sportRooms.map((sr) => (
                <option key={sr.id} value={sr.id}>{getSportRoomLabel(sr)}</option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.sport_room_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Día <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              style={{ fontSize: "14px" }}
            >
              {DIAS_SEMANA.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Hora Inicio <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              isInvalid={!!errors.start_time}
              style={{ fontSize: "14px" }}
            />
            <Form.Control.Feedback type="invalid">{errors.start_time}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Hora Fin <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              isInvalid={!!errors.end_time}
              style={{ fontSize: "14px" }}
            />
            <Form.Control.Feedback type="invalid">{errors.end_time}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Check
              type="switch"
              id="sched-status-switch"
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
            {selected ? "Guardar Cambios" : "Crear Horario"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ScheduleFormModal;