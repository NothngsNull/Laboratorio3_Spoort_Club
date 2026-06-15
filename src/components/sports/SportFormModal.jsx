// src/components/sports/SportFormModal.jsx
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const INITIAL_FORM = {
  name: "",
  objective: "",
  duration: "",
  status: true,
};

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors]     = useState({});

  // Sincroniza formulario al abrir
  useEffect(() => {
    if (selectedSport) {
      setFormData({
        name:      selectedSport.name      || "",
        objective: selectedSport.objective || "",
        duration:  selectedSport.duration  || "",
        status:    selectedSport.status    ?? true,
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [selectedSport, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Limpia el error del campo que se está editando
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validaciones antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    }
    if (!formData.objective.trim()) {
      newErrors.objective = "El objetivo es obligatorio.";
    }
    if (!formData.duration || isNaN(formData.duration) || Number(formData.duration) <= 0) {
      newErrors.duration = "La duración es obligatoria y debe ser un número positivo.";
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
      name:      formData.name.trim(),
      objective: formData.objective.trim(),
      duration:  Number(formData.duration),
      status:    formData.status,
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>

      {/* Cabecera con color Admin (morado/rojo corporativo) */}
      <Modal.Header
        closeButton
        style={{ background: "linear-gradient(90deg, #2E1A47, #4a2d6e)", borderBottom: "3px solid #F2B705" }}
      >
        <Modal.Title style={{ color: "#fff", fontWeight: 700, fontSize: "18px" }}>
          {selectedSport ? "✏️ Editar Deporte" : "➕ Nuevo Deporte"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit} noValidate>
        <Modal.Body style={{ background: "#fafafa" }}>

          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Nombre <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: CrossFit"
              isInvalid={!!errors.name}
              style={{ fontSize: "14px" }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Objetivo */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Objetivo <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              placeholder="Ej: Mejorar fuerza y resistencia general"
              isInvalid={!!errors.objective}
              style={{ fontSize: "14px" }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.objective}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Duración */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ fontSize: "14px", color: "#2E1A47" }}>
              Duración (minutos) <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Ej: 60"
              min={1}
              isInvalid={!!errors.duration}
              style={{ fontSize: "14px" }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.duration}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Estado */}
          <Form.Group className="mb-1">
            <Form.Check
              type="switch"
              id="status-switch-modal"
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
            {selectedSport ? "Guardar Cambios" : "Crear Deporte"}
          </Button>
        </Modal.Footer>
      </Form>

    </Modal>
  );
}

export default SportFormModal;
