import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      
      {/* NAVBAR */}
      <Navbar className="bg-corporate py-3 border-bottom border-3 border-warning" expand="lg" sticky="top" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-white">
            Sport<span className="text-corporate-accent">Club</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav" className="justify-content-end">
            <Nav className="gap-3 mt-3 mt-lg-0">
              <Button as={Link} to="/login" className="btn-corporate-outline px-4">
                Iniciar Sesión
              </Button>
              <Button as={Link} to="/login" className="btn-corporate-solid px-4">
                Registrarse
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* HERO SECTION */}
      <section className="hero-section text-white text-center py-5 d-flex align-items-center justify-content-center flex-grow-1" style={{ minHeight: '60vh' }}>
        <Container>
          <h1 className="display-2 fw-bold text-corporate-accent mb-3 fst-italic letter-spacing-3">SPORTCLUB</h1>
          <h2 className="fs-2 mb-4 text-white">Tu mejor versión comienza hoy</h2>
          <p className="lead mx-auto fst-italic mb-5 text-light" style={{ maxWidth: '800px' }}>
            "En SportClub no solo vienes a entrenar… vienes a crecer, a superarte y a construir tu mejor versión."
          </p>
        </Container>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-5 bg-light">
        <Container className="text-center py-5">
          <h2 className="fw-bold display-5 mb-5 text-corporate">El Deporte Transforma</h2>
          <Row className="g-4 justify-content-center">
            <Col md={5}>
              <Card className="custom-card h-100 p-4">
                <Card.Body>
                  <Card.Title className="fw-bold fs-3 mb-3 text-corporate">Nuestro Enfoque</Card.Title>
                  <Card.Text className="text-muted fs-5">
                    En SportClub creemos que el deporte no solo transforma el cuerpo, sino también la mente y el estilo de vida. Nuestro objetivo es acompañar a cada persona en su proceso.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              <Card className="custom-card h-100 p-4">
                <Card.Body>
                  <Card.Title className="fw-bold fs-3 mb-3 text-corporate">Comunidad y Bienestar</Card.Title>
                  <Card.Text className="text-muted fs-5">
                    Somos una comunidad enfocada en el bienestar, el compromiso y la superación personal. Contamos con entrenadores especializados y programas personalizados.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* VISION SECTION */}
      <section className="py-5 bg-white">
        <Container className="py-4">
          <div className="bg-corporate text-white p-5 rounded-4 shadow-lg text-center mx-auto" style={{ maxWidth: '900px' }}>
            <h2 className="fw-bold display-5 mb-4 text-corporate-accent">Nuestra Visión</h2>
            <p className="lead mx-auto mb-0">
              Queremos ser el club deportivo referente en la formación integral de personas, combinando tecnología, entrenamiento y comunidad para mejorar la calidad de vida de nuestros usuarios.
            </p>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="bg-corporate-dark text-white text-center py-4 mt-auto border-top border-warning">
        <Container>
          <p className="mb-0 text-white-50">&copy; 2026 SportClub. Todos los derechos reservados.</p>
        </Container>
      </footer>
      
    </div>
  );
}

export default Home;