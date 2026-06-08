import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function CoachDashboard() {
  return (
    <div>
      <h2 className="fw-bold mb-4 text-dark">Panel de Control Deportivo</h2>
      <Row className="g-4">
        <Col md={6}>
          <Card className="custom-card h-100 p-3">
            <Card.Body>
              <Card.Title className="fw-bold text-corporate">Mis Clases Asignadas</Card.Title>
              <Card.Text className="text-muted">Visualiza tu calendario de la semana y salones correspondientes.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="custom-card h-100 p-3">
            <Card.Body>
              <Card.Title className="fw-bold text-corporate">Control de Asistencia</Card.Title>
              <Card.Text className="text-muted">Gestiona el listado de alumnos inscritos en cada una de tus disciplinas.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default CoachDashboard;