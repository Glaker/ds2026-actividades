import { Container } from 'react-bootstrap'
import LibroCard from './components/LibroCard'

// Componente raíz: por ahora prueba una sola LibroCard pasándole props
function App() {
  return (
    <Container className="py-4" style={{ maxWidth: '22rem' }}>
      <LibroCard
        titulo="Rayuela"
        autor="Julio Cortázar"
        imagen="https://covers.openlibrary.org/b/id/1047466-M.jpg"
      />
    </Container>
  )
}

export default App
