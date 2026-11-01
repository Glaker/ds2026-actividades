import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { libroSchema } from '../schemas/libroSchema'
import type { LibroFormInput, LibroValidado } from '../schemas/libroSchema'

// Formulario de alta con React Hook Form; las reglas las pone el schema de Zod
function LibroNuevo() {
  const navigate = useNavigate()

  // Genéricos: valores crudos del form, contexto, y datos ya validados que recibe onSubmit
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LibroFormInput, unknown, LibroValidado>({
    resolver: zodResolver(libroSchema),
    defaultValues: { titulo: '', autor: '', precio: '', disponible: true },
  })

  // Solo se ejecuta si el schema validó; datos ya tipados (precio es number)
  const onSubmit = (datos: LibroValidado) => {
    // TODO: POST al backend (Bloque 3)
    console.log('Libro válido (todavía no se guarda):', datos)
    navigate('/catalogo')
  }

  return (
    <section className="mx-auto" style={{ maxWidth: 560 }}>
      <h1 className="mb-4">Nuevo libro</h1>
      {/* noValidate: la validación la hace Zod, no el navegador */}
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="titulo">
          <Form.Label>Título</Form.Label>
          <Form.Control {...register('titulo')} isInvalid={!!errors.titulo} />
          <Form.Control.Feedback type="invalid">{errors.titulo?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="autor">
          <Form.Label>Autor</Form.Label>
          <Form.Control {...register('autor')} isInvalid={!!errors.autor} />
          <Form.Control.Feedback type="invalid">{errors.autor?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="precio">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            min="0"
            step="0.01"
            {...register('precio')}
            isInvalid={!!errors.precio}
          />
          <Form.Control.Feedback type="invalid">{errors.precio?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="disponible">
          <Form.Check type="checkbox" label="Disponible" {...register('disponible')} />
        </Form.Group>

        <Button type="submit">Agregar libro</Button>
      </Form>
    </section>
  )
}

export default LibroNuevo
