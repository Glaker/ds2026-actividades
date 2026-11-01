import type { z } from "zod";
import type { registroSchema, loginSchema } from "../validations/auth.validation";

// Los tipos salen de los schemas: si cambia una regla, cambia el tipo solo
export type Registro = z.infer<typeof registroSchema>;
export type Login = z.infer<typeof loginSchema>;

// Lo único que se devuelve de un usuario: nunca el passwordHash
export type UsuarioPublico = { id: number; email: string; nombre: string; rol: "ADMIN" | "CLIENTE" };

// Lo que va dentro del JWT: solo id y rol (el payload lo puede leer cualquiera)
export type PayloadToken = { id: number; rol: "ADMIN" | "CLIENTE" };
