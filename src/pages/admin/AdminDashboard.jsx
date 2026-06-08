import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function AdminDashboard() {
  return (
    <div>
      <h2 className="fw-bold mb-4 text-dark">Gestión General Administrativa</h2>
      <Row className="g-4">
        <Col md={3}>
          <Card className="custom-card h-100 p-3">
            <Card.Body>
              <Card.Title className="fw-bold text-corporate">Usuarios</Card.Title>
              <Card.Text className="text-muted small">Administra altas, bajas y roles de usuarios.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="custom-card h-100 p-3">
            <Card.Body>
              <Card.Title className="fw-bold text-corporate">Deportes</Card.Title>
              <Card.Text className="text-muted small">Catálogo de disciplinas disponibles.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="custom-card h-100 p-3">
            <Card.Body>
              <Card.Title className="fw-bold text-corporate">Entrenadores</Card.Title>
              <Card.Text className="text-muted small">Gestión del staff técnico del club.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="custom-card h-100 p-3">
            <Card.Body>
              <Card.Title className="fw-bold text-corporate">Clases</Card.Title>
              <Card.Text className="text-muted small">Configuración de horarios y salones globales.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default AdminDashboard;