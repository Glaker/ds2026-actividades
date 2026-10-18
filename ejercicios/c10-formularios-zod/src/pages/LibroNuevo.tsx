import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import type { Libro } from '../types/libro'

// App le pasa la función que agrega el libro al estado
type LibroNuevoProps = {
  onAgregar: (nuevo: Libro) => void
}

// Valores del formulario: precio es string porque así lo devuelve el input
type FormLibro = {
  titulo: string
  autor: string
  precio: string
  disponible: boolean
}

// Portada local para los libros cargados a mano (no depende de internet)
const PORTADA_DEFAULT = '/img/sin-portada.svg'

const FORM_VACIO: FormLibro = { titulo: '', autor: '', precio: '', disponible: true }

// Devuelve un error por campo inválido; vacío si todo está bien
function validar(form: FormLibro): Record<string, string> {
  const errores: Record<string, string> = {}
  if (form.titulo.trim() === '') errores.titulo = 'El título es obligatorio'
  if (form.autor.trim() === '') errores.autor = 'El autor es obligatorio'
  if (!(Number(form.precio) > 0)) errores.precio = 'El precio debe ser mayor a 0'
  return errores
}

// Formulario controlado para dar de alta un libro
function LibroNuevo({ onAgregar }: LibroNuevoProps) {
  const [form, setForm] = useState<FormLibro>(FORM_VACIO)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  // Un solo handler: usa el name del input como clave; el checkbox usa checked
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nuevosErrores = validar(form)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    onAgregar({
      id: Date.now(),
      titulo: form.titulo.trim(),
      autor: form.autor.trim(),
      imagen: PORTADA_DEFAULT,
      precio: Number(form.precio),
      disponible: form.disponible,
    })
    navigate('/catalogo')
  }

  return (
    <section className="mx-auto" style={{ maxWidth: 560 }}>
      <h1 className="mb-4">Nuevo libro</h1>
      {/* noValidate: la validación la hacemos nosotros, no el navegador */}
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="titulo">
          <Form.Label>Título</Form.Label>
          <Form.Control
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            isInvalid={!!errores.titulo}
          />
          <Form.Control.Feedback type="invalid">{errores.titulo}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="autor">
          <Form.Label>Autor</Form.Label>
          <Form.Control
            name="autor"
            value={form.autor}
            onChange={handleChange}
            isInvalid={!!errores.autor}
          />
          <Form.Control.Feedback type="invalid">{errores.autor}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="precio">
          <Form.Label>Precio</Form.Label>
          <Form.Control
            type="number"
            name="precio"
            min="0"
            step="0.01"
            value={form.precio}
            onChange={handleChange}
            isInvalid={!!errores.precio}
          />
          <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="disponible">
          <Form.Check
            type="checkbox"
            name="disponible"
            label="Disponible"
            checked={form.disponible}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit">Agregar libro</Button>
      </Form>
    </section>
  )
}

export default LibroNuevo
