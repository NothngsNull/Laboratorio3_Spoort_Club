import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function UserDashboard() {
  return (
    <div>
      <h2 className="fw-bold mb-4 text-dark">Resumen de mi cuenta</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="custom-card h-100 p-3">
            <Card.Body>
              <Card.Title className="fw-bold text-corporate">Mis Reservas</Card.Title>
              <Card.Text className="text-muted">Consulta tus próximas clases y horarios.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="custom-card h-100 p-3">
            <Card.Body>
              <Card.Title className="fw-bold text-corporate">Clases Disponibles</Card.Title>
              <Card.Text className="text-muted">Explora la parrilla semanal e inscríbete.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="custom-card h-100 p-3">
            <Card.Body>
              <Card.Title className="fw-bold text-corporate">Mi Perfil</Card.Title>
              <Card.Text className="text-muted">Actualiza tus datos y objetivos personales.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default UserDashboard;