import { Container } from 'react-bootstrap'
import AppNavbar from './components/AppNavbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import LibroCard from './components/LibroCard'

// Componente raíz: navbar, hero y footer; la grilla de destacados va en el paso 5
function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main>
        <Hero
          titulo="Bienvenido a la Librería"
          subtitulo="Encontrá tu próxima lectura entre miles de títulos."
        />
        <Container className="py-5" style={{ maxWidth: '22rem' }}>
          <LibroCard
            titulo="Rayuela"
            autor="Julio Cortázar"
            imagen="https://covers.openlibrary.org/b/id/1047466-M.jpg"
          />
        </Container>
      </main>
      <Footer />
    </div>
  )
}

export default App
