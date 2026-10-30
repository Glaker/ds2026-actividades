import { z } from "zod";

export const libroCreateSchema = z.object({
  // { error } cubre el campo ausente o de otro tipo; min(1) cubre el string vacío
  titulo: z.string({ error: "El título es obligatorio" }).trim().min(1, "El título es obligatorio").max(200),
  precio: z.number({ error: "El precio debe ser un número" }).int().positive("El precio debe ser mayor a 0"),
  imagen: z.string({ error: "La imagen es obligatoria" }).min(1, "La imagen es obligatoria"),
  // optional y no default: .partial() no borra un default, y el update pisaría disponible con true.
  // El default vive en Prisma (@default(true))
  disponible: z.boolean().optional(),
  autorId: z.number({ error: "El autor es obligatorio" }).int().positive("El autor es obligatorio"),
});

// En el update todos los campos son opcionales
export const libroUpdateSchema = libroCreateSchema.partial();

// Todo lo que viene en la URL es string: coerce lo convierte a número antes de validar
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("El id debe ser un número positivo"),
});

export type LibroCreate = z.infer<typeof libroCreateSchema>;
export type LibroUpdate = z.infer<typeof libroUpdateSchema>;
