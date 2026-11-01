import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Estilos de Bootstrap e íconos (antes de los propios, para poder pisarlos)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter sincroniza la URL del navegador con las rutas de la app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
