import { Badge, Col, Image, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import type { Libro } from '../types/libro'

// Recibe el listado desde App, así también encuentra los libros recién agregados
type LibroDetalleProps = {
  libros: Libro[]
}

// Detalle de un libro según el :id de la URL (ej: /libros/3)
function LibroDetalle({ libros }: LibroDetalleProps) {
  // useParams devuelve los parámetros de la ruta como string
  const { id } = useParams<{ id: string }>()
  const libro = libros.find((l) => l.id === Number(id))

  if (!libro) {
    return (
      <section className="text-center py-5">
        <h1>Libro no encontrado</h1>
        <p className="text-body-secondary">No existe un libro con id "{id}".</p>
        <Link to="/catalogo" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </section>
    )
  }

  return (
    <Row as="article" className="g-4">
      <Col md={4}>
        <Image src={libro.imagen} alt={`Portada de ${libro.titulo}`} fluid rounded />
      </Col>
      <Col md={8}>
        <h1>{libro.titulo}</h1>
        <p className="lead text-body-secondary">{libro.autor}</p>
        <p className="fs-4">
          ${libro.precio.toLocaleString('es-AR')}{' '}
          <Badge bg={libro.disponible ? 'success' : 'secondary'}>
            {libro.disponible ? 'Disponible' : 'Sin stock'}
          </Badge>
        </p>
        <Link to="/catalogo" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left"></i> Volver al catálogo
        </Link>
      </Col>
    </Row>
  )
}

export default LibroDetalle
