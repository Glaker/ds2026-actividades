import type { ReactNode } from 'react'
import { Container } from 'react-bootstrap'
import Footer from './Footer'
import Header from './Header'

// Lo que se renderiza entre el header y el footer (la página actual)
type LayoutProps = {
  children: ReactNode
}

// Estructura común a todas las páginas; flex + min-vh-100 empuja el footer al fondo
function Layout({ children }: LayoutProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container as="main" className="py-4">
        {children}
      </Container>
      <Footer />
    </div>
  )
}

export default Layout
