import { Alert, Spinner } from 'react-bootstrap'
import ListaLibros from '../components/ListaLibros'
import { useFetch } from '../hooks/useFetch'
import type { Libro } from '../types/libro'

// Página con todos los libros de la tienda, leídos del mock con useFetch
function Catalogo() {
  const { data: libros, loading, error } = useFetch<Libro[]>('/libros.json')

  if (loading) return <Spinner animation="border" />
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <section>
      <h1 className="mb-4">Catálogo</h1>
      <ListaLibros libros={libros ?? []} />
    </section>
  )
}

export default Catalogo
