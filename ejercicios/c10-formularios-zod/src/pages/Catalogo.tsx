import ListaLibros from '../components/ListaLibros'
import type { Libro } from '../types/libro'

// Recibe el listado desde App (el estado)
type CatalogoProps = {
  libros: Libro[]
}

// Página con todos los libros de la tienda
function Catalogo({ libros }: CatalogoProps) {
  return (
    <section>
      <h1 className="mb-4">Catálogo</h1>
      <ListaLibros libros={libros} />
    </section>
  )
}

export default Catalogo
