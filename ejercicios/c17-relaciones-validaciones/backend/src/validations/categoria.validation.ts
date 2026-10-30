import { z } from "zod";

export const categoriaCreateSchema = z.object({
  nombre: z.string({ error: "El nombre es obligatorio" }).trim().min(1, "El nombre es obligatorio").max(100),
});

export const categoriaUpdateSchema = categoriaCreateSchema.partial();

export type CategoriaCreate = z.infer<typeof categoriaCreateSchema>;
export type CategoriaUpdate = z.infer<typeof categoriaUpdateSchema>;
