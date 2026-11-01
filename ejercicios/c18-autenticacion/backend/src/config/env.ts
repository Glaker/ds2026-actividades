import type { SignOptions } from "jsonwebtoken";

// Lee una variable de entorno obligatoria. Si falta, la app no arranca:
// mejor romper al iniciar que firmar tokens con un secreto undefined.
function obligatorio(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta ${nombre} en el .env`);
  return valor;
}

// Secreto con el que se firman y verifican los JWT. Solo en .env (nunca en Git).
export const JWT_SECRET = obligatorio("JWT_SECRET");

// Duración del token. Es una decisión de la app, no un secreto: va en el código.
export const JWT_EXPIRES_IN: SignOptions["expiresIn"] = "2h";

// Costo de bcrypt: 2^10 rondas. Cada +1 duplica el tiempo de hashear.
export const SALT_ROUNDS = 10;
