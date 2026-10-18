import Layout from './components/Layout/Layout'
import Home from './pages/Home'

// Componente raíz: envuelve la página de inicio con el Layout común
function App() {
  return (
    <Layout>
      <Home />
    </Layout>
  )
}

export default App
