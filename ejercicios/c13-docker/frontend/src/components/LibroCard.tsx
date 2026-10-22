import { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Datos que recibe la card desde el componente padre
type LibroCardProps = {
  id: number
  titulo: string
  autor: string
  imagen: string
}

// Imagen de respaldo (copiada de la C06) por si la portada no carga
const PORTADA_DEFAULT = '/img/sin-portada.svg'

// Card de un libro: portada, título, autor, botón "Me gusta" y "Ver más"
function LibroCard({ id, titulo, autor, imagen }: LibroCardProps) {
  // Estado propio de cada card: cada instancia lleva su contador
  const [likes, setLikes] = useState<number>(0)

  return (
    <Card as="article" className="h-100">
      <Card.Img
        variant="top"
        src={imagen}
        alt={`Portada de ${titulo}`}
        className="portada"
        onError={(e) => {
          // Evita un loop si también falla la imagen de respaldo
          if (!e.currentTarget.src.endsWith(PORTADA_DEFAULT)) {
            e.currentTarget.src = PORTADA_DEFAULT
          }
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h3" className="h5">
          {titulo}
        </Card.Title>
        <Card.Text className="text-body-secondary">{autor}</Card.Text>
        <div className="d-flex gap-2 mt-auto">
          <Button
            variant="outline-danger"
            onClick={() => setLikes(likes + 1)}
          >
            <i className="bi bi-heart-fill"></i> Me gusta ({likes})
          </Button>
          {/* Lleva al detalle de este libro, ej: /libros/3 */}
          <Link
            to={`/libros/${id}`}
            className="btn btn-outline-primary flex-grow-1"
          >
            Ver más
          </Link>
        </div>
      </Card.Body>
    </Card>
  )
}

export default LibroCard
