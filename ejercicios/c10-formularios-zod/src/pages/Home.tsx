import Hero from '../components/Hero'
import ListaLibros from '../components/ListaLibros'
import { libros } from '../data/libros'

// Página de inicio: hero y los primeros libros como destacados
function Home() {
  return (
    <>
      <Hero
        titulo="Bienvenido a la Librería"
        subtitulo="Encontrá tu próxima lectura entre miles de títulos."
      />

      <section className="pt-5">
        <h2 className="mb-4">Destacados</h2>
        <ListaLibros libros={libros.slice(0, 3)} />
      </section>
    </>
  )
}

export default Home
