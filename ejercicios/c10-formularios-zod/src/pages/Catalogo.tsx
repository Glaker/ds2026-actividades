import ListaLibros from '../components/ListaLibros'
import { libros } from '../data/libros'

// Página con todos los libros de la tienda
function Catalogo() {
  return (
    <section>
      <h1 className="mb-4">Catálogo</h1>
      <ListaLibros libros={libros} />
    </section>
  )
}

export default Catalogo
