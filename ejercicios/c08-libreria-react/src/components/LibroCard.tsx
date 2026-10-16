import { Button, Card } from 'react-bootstrap'

// Datos que recibe la card desde el componente padre
type LibroCardProps = {
  titulo: string
  autor: string
  imagen: string
}

// Card de un libro: portada, título, autor y botón (mismo look que la C06)
function LibroCard({ titulo, autor, imagen }: LibroCardProps) {
  return (
    <Card as="article" className="h-100">
      <Card.Img
        variant="top"
        src={imagen}
        alt={`Portada de ${titulo}`}
        className="portada"
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h3" className="h5">
          {titulo}
        </Card.Title>
        <Card.Text className="text-body-secondary">{autor}</Card.Text>
        <Button variant="outline-primary" className="mt-auto">
          Ver más
        </Button>
      </Card.Body>
    </Card>
  )
}

export default LibroCard
