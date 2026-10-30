import { z } from "zod";

export const autorCreateSchema = z.object({
  nombre: z.string({ error: "El nombre es obligatorio" }).trim().min(1, "El nombre es obligatorio").max(100),
  nacionalidad: z.string({ error: "La nacionalidad es obligatoria" }).trim().min(1, "La nacionalidad es obligatoria").max(100),
});

export const autorUpdateSchema = autorCreateSchema.partial();

export type AutorCreate = z.infer<typeof autorCreateSchema>;
export type AutorUpdate = z.infer<typeof autorUpdateSchema>;
