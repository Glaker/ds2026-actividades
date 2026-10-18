import { Col, Row } from 'react-bootstrap'
import Hero from '../components/Hero'
import LibroCard from '../components/LibroCard'
import { librosDestacados } from '../data/libros'

// Página de inicio: hero y grilla de destacados (header y footer los pone Layout)
function Home() {
  return (
    <>
      <Hero
        titulo="Bienvenido a la Librería"
        subtitulo="Encontrá tu próxima lectura entre miles de títulos."
      />

      {/* Grilla responsive: 1 columna en mobile, 2 en tablet, 3 en escritorio */}
      <section id="destacados" className="pt-5">
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
      </section>
    </>
  )
}

export default Home
