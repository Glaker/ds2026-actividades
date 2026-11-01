import { z } from 'zod'

// Reglas del formulario de alta (zod v4: el mensaje va en { error })
export const libroSchema = z.object({
  titulo: z.string().trim().min(1, { error: 'El título es obligatorio' }),
  autor: z.string().trim().min(1, { error: 'El autor es obligatorio' }),
  // coerce convierte el string del input a number antes de validar ('' pasa a 0)
  precio: z.coerce.number().positive({ error: 'El precio debe ser mayor a 0' }),
  disponible: z.boolean(),
})

// Tipo de los datos ya validados (precio es number, strings sin espacios)
export type LibroValidado = z.infer<typeof libroSchema>

// Tipo de los valores crudos del formulario (antes de validar): con coerce, precio es unknown
export type LibroFormInput = z.input<typeof libroSchema>
