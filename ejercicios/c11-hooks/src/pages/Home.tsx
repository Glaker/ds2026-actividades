import { Alert, Spinner } from 'react-bootstrap'
import Hero from '../components/Hero'
import ListaLibros from '../components/ListaLibros'
import { useFetch } from '../hooks/useFetch'
import type { Libro } from '../types/libro'

// Página de inicio: hero y los primeros libros como destacados
function Home() {
  const { data: libros, loading, error } = useFetch<Libro[]>('/libros.json')

  return (
    <>
      <Hero
        titulo="Bienvenido a la Librería"
        subtitulo="Encontrá tu próxima lectura entre miles de títulos."
      />

      <section className="pt-5">
        <h2 className="mb-4">Destacados</h2>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {libros && <ListaLibros libros={libros.slice(0, 6)} />}
      </section>
    </>
  )
}

export default Home
