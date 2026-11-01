import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// El adapter es el driver: el que realmente habla TCP con PostgreSQL
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Una sola instancia para toda la app: abre un pool de conexiones y lo reutiliza.
// omit global: passwordHash nunca sale en ninguna query salvo que se pida explícito
// con omit: { passwordHash: false } (solo el login lo necesita). Seguro por defecto.
export const prisma = new PrismaClient({
  adapter,
  omit: { usuario: { passwordHash: true } },
});
