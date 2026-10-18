import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import { librosIniciales } from './data/libros'
import Catalogo from './pages/Catalogo'
import Home from './pages/Home'
import LibroDetalle from './pages/LibroDetalle'
import LibroNuevo from './pages/LibroNuevo'
import type { Libro } from './types/libro'

// Componente raíz: el Layout es fijo y Routes elige qué página mostrar según la URL
function App() {
  // El listado vive acá para que todas las páginas compartan los mismos datos
  const [libros, setLibros] = useState<Libro[]>(librosIniciales)

  // Agrega sin mutar: crea un array nuevo con el libro al final
  const agregarLibro = (nuevo: Libro) => setLibros([...libros, nuevo])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home libros={libros} />} />
        <Route path="/catalogo" element={<Catalogo libros={libros} />} />
        {/* Va antes que /libros/:id por claridad (React Router igual prioriza la ruta fija) */}
        <Route path="/libros/nuevo" element={<LibroNuevo onAgregar={agregarLibro} />} />
        <Route path="/libros/:id" element={<LibroDetalle libros={libros} />} />
      </Routes>
    </Layout>
  )
}

export default App
