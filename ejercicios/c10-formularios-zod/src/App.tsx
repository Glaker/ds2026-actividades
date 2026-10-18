import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Catalogo from './pages/Catalogo'
import Home from './pages/Home'
import LibroDetalle from './pages/LibroDetalle'

// Componente raíz: el Layout es fijo y Routes elige qué página mostrar según la URL
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/libros/:id" element={<LibroDetalle />} />
      </Routes>
    </Layout>
  )
}

export default App
