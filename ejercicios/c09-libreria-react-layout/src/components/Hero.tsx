import { Button, Container } from 'react-bootstrap'

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
        <Button variant="light" size="lg" href="#destacados">
          Ver catálogo
        </Button>
      </Container>
    </section>
  )
}

export default Hero
