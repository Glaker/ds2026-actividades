import { Container, Nav, Navbar } from 'react-bootstrap'

// Barra de navegación oscura; en pantallas chicas los links se colapsan en el botón hamburguesa
function AppNavbar() {
  return (
    <header>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#">
            <i className="bi bi-book-half"></i> Librería
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
          <Navbar.Collapse id="menu-principal">
            <Nav className="ms-auto">
              <Nav.Link href="#">Inicio</Nav.Link>
              <Nav.Link href="#destacados">Catálogo</Nav.Link>
              <Nav.Link href="#contacto">Contacto</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default AppNavbar
