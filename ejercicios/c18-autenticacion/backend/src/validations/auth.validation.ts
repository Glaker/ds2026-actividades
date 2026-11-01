import { z } from "zod";

// Primero se normaliza (trim + minúsculas) y DESPUÉS se valida el formato:
// " Ana@Mail.com " pasa a "ana@mail.com" y es el mismo usuario en registro y login.
// z.email() es la forma de Zod 4 (z.string().email() está deprecado).
const email = z.string().trim().toLowerCase().pipe(z.email("Email inválido"));

// No hay campo rol: lo pone la base (@default(CLIENTE)). Zod descarta claves
// desconocidas, así que un "rol": "ADMIN" en el body ni llega al service.
export const registroSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email,
  password: z
    .string()
    .min(8, "La contraseña necesita al menos 8 caracteres")
    .regex(/[A-Z]/, "Necesita al menos una mayúscula")
    .regex(/[0-9]/, "Necesita al menos un número"),
});

// El login NO valida fortaleza: solo que venga algo. Si las reglas cambian, un usuario
// viejo con clave "débil" tiene que poder seguir entrando; y no le damos pistas a nadie.
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "La contraseña es obligatoria"),
});
