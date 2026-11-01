import { Col, Row } from 'react-bootstrap'
import type { Libro } from '../types/libro'
import LibroCard from './LibroCard'

// Libros a mostrar en la grilla
type ListaLibrosProps = {
  libros: Libro[]
}

// Grilla responsive de cards: 1 columna en mobile, 2 en tablet, 3 en escritorio
function ListaLibros({ libros }: ListaLibrosProps) {
  return (
    <Row xs={1} sm={2} lg={3} className="g-4">
      {libros.map((libro) => (
        <Col key={libro.id}>
          <LibroCard
            id={libro.id}
            titulo={libro.titulo}
            autor={libro.autor}
            imagen={libro.imagen}
          />
        </Col>
      ))}
    </Row>
  )
}

export default ListaLibros
