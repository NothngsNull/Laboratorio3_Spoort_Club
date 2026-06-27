import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const INITIAL_FORM = {
  name: "",
  description: "",
  capacity: "",
  location: "",
  status: true,
};

function RoomFormModal({ show, handleClose, handleSave, selectedRoom }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        name: selectedRoom.name || "",
        description: selectedRoom.description || "",
        capacity: selectedRoom.capacity || "",
        location: selectedRoom.location || "",
        status: selectedRoom.status ?? true,
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [selectedRoom, show]);

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
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    }
    if (!formData.description.trim() || formData.description.trim().length < 5) {
      newErrors.description = "La descripción es obligatoria (mínimo 5 caracteres).";
    }
    if (!formData.capacity || isNaN(formData.capacity) || Number(formData.capacity) < 1) {
      newErrors.capacity = "La capacidad es obligatoria y debe ser al menos 1.";
    }
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
      name: formData.name.trim(),
      description: formData.description.trim(),
      capacity: Number(formData.capacity),
      location: formData.location.trim(),
      status: formData.status,
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        style={{ background: "linear-gradient(90deg, #2E1A47, #4a2d6e)", borderBottom: "3px solid #F2B705" }}
      >
        <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
          {selectedRoom ? "✏️ Editar Sala" : "➕ Nueva Sala"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit} noValidate>
        <Modal.Body style={{ background: "#fafafa" }}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Nombre <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Sala A1"
              isInvalid={!!errors.name}
              style={{ fontSize: "14px" }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Descripción <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ej: Sala amplia para clases grupales"
              isInvalid={!!errors.description}
              style={{ fontSize: "14px" }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Capacidad <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Ej: 30"
              min={1}
              isInvalid={!!errors.capacity}
              style={{ fontSize: "14px" }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.capacity}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Ubicación
            </Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej: Primer Piso, Ala Norte"
              style={{ fontSize: "14px" }}
            />
          </Form.Group>

          <Form.Group className="mb-1">
            <Form.Check
              type="switch"
              id="room-status-switch"
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
            {selectedRoom ? "Guardar Cambios" : "Crear Sala"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RoomFormModal;