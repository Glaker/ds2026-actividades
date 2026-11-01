import { useEffect } from 'react'
import { Alert, Spinner } from 'react-bootstrap'
import ListaLibros from '../components/ListaLibros'
import { useFetch } from '../hooks/useFetch'
import type { Libro } from '../types/libro'

// Página con todos los libros de la tienda, leídos del mock con useFetch
function Catalogo() {
  const { data: libros, loading, error } = useFetch<Libro[]>('/libros.json')

  // Refleja la cantidad de libros en la pestaña; se re-ejecuta cuando cambia libros
  useEffect(() => {
    if (!libros) return
    const tituloAnterior = document.title
    document.title = `Catálogo (${libros.length} libros)`
    // Cleanup: al salir de la página se restaura el título anterior
    return () => {
      document.title = tituloAnterior
    }
  }, [libros])

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
