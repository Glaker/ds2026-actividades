import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Encabezado del sitio: barra de navegación oscura; en pantallas chicas los links se colapsan en el botón hamburguesa
function Header() {
  return (
    <header>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <i className="bi bi-book-half"></i> Librería
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
          <Navbar.Collapse id="menu-principal">
            <Nav className="ms-auto">
              {/* Link cambia de ruta sin recargar la página */}
              <Nav.Link as={Link} to="/">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/catalogo">
                Catálogo
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
