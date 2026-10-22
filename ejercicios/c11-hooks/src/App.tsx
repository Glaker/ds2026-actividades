import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Catalogo from './pages/Catalogo'
import Home from './pages/Home'
import LibroDetalle from './pages/LibroDetalle'
import LibroNuevo from './pages/LibroNuevo'

// Componente raíz: el Layout es fijo y Routes elige qué página mostrar según la URL
function App() {
  return (
    <Layout>
      <Routes>
        {/* TEMPORAL (paso 4): Home, LibroDetalle y LibroNuevo todavía piden props */}
        <Route path="/" element={<Home libros={[]} />} />
        <Route path="/catalogo" element={<Catalogo />} />
        {/* Va antes que /libros/:id por claridad (React Router igual prioriza la ruta fija) */}
        <Route path="/libros/nuevo" element={<LibroNuevo onAgregar={() => {}} />} />
        <Route path="/libros/:id" element={<LibroDetalle libros={[]} />} />
      </Routes>
    </Layout>
  )
}

export default App
