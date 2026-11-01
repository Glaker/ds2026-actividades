import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Textos que recibe la sección de bienvenida
type HeroProps = {
  titulo: string
  subtitulo: string
}

// Sección de bienvenida con el degradado de la C06 (clase .hero en index.css)
function Hero({ titulo, subtitulo }: HeroProps) {
  return (
    <section className="hero text-white text-center py-5">
      <Container className="py-5">
        <h1 className="display-4 fw-bold">{titulo}</h1>
        <p className="lead mb-4">{subtitulo}</p>
        {/* Link con clases de botón de Bootstrap (Button no tipa bien con as={Link}) */}
        <Link to="/catalogo" className="btn btn-light btn-lg">
          Ver catálogo
        </Link>
      </Container>
    </section>
  )
}

export default Hero
