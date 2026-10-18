import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Estilos de Bootstrap e íconos (antes de los propios, para poder pisarlos)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
