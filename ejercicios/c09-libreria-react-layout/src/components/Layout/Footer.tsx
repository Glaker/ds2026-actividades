import { Container } from 'react-bootstrap'

// Pie de página oscuro, haciendo juego con la navbar
function Footer() {
  return (
    <footer id="contacto" className="bg-dark text-white-50 py-4 mt-auto">
      <Container className="d-flex flex-column flex-sm-row justify-content-between gap-2">
        <span>
          <i className="bi bi-book-half"></i> Librería © 2026
        </span>
        <span>
          <i className="bi bi-envelope"></i> contacto@libreria.com
        </span>
      </Container>
    </footer>
  )
}

export default Footer
