import { Col, Container, Row } from 'react-bootstrap'
import AppNavbar from '../components/AppNavbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import LibroCard from '../components/LibroCard'
import { librosDestacados } from '../data/libros'

// Página de inicio: navbar, hero, grilla de destacados y footer
function Home() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main>
        <Hero
          titulo="Bienvenido a la Librería"
          subtitulo="Encontrá tu próxima lectura entre miles de títulos."
        />

        {/* Grilla responsive: 1 columna en mobile, 2 en tablet, 3 en escritorio */}
        <Container as="section" id="destacados" className="py-5">
          <h2 className="mb-4">Destacados</h2>
          <Row xs={1} sm={2} lg={3} className="g-4">
            {librosDestacados.map((libro) => (
              <Col key={libro.id}>
                <LibroCard
                  titulo={libro.titulo}
                  autor={libro.autor}
                  imagen={libro.imagen}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
      <Footer />
    </div>
  )
}

export default Home
