import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { JWT_SECRET, JWT_EXPIRES_IN, SALT_ROUNDS } from "../config/env";
import type { Registro, Login, PayloadToken, UsuarioPublico } from "../types/auth.types";

// Los únicos campos de un usuario que salen de la API
const camposPublicos = { id: true, email: true, nombre: true, rol: true } as const;

export async function registrar(datos: Registro): Promise<UsuarioPublico> {
  // Se guarda el hash, nunca la contraseña. El salt va adentro del hash.
  const hash = await bcrypt.hash(datos.password, SALT_ROUNDS);
  // Sin rol: lo pone la base (@default(CLIENTE)). Email repetido -> P2002 -> 409 en el errorHandler
  return prisma.usuario.create({
    data: { nombre: datos.nombre, email: datos.email, passwordHash: hash },
    select: camposPublicos,
  });
}

export async function login(datos: Login): Promise<{ token: string; usuario: UsuarioPublico } | null> {
  // El omit global esconde el hash: acá es el único lugar donde se pide explícito
  const usuario = await prisma.usuario.findUnique({
    where: { email: datos.email },
    omit: { passwordHash: false },
  });
  if (!usuario) return null;

  // compare saca el salt del hash guardado, hashea la clave recibida y compara
  const coincide = await bcrypt.compare(datos.password, usuario.passwordHash);
  if (!coincide) return null; // mismo return que arriba, a propósito (user enumeration)

  // En el payload solo id y rol: está firmado, no encriptado. iat/exp los agrega jwt.sign
  const payload: PayloadToken = { id: usuario.id, rol: usuario.rol };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol },
  };
}

export async function findById(id: number): Promise<UsuarioPublico | null> {
  // El omit global ya oculta el hash; el select además deja afuera creadoEn
  return prisma.usuario.findUnique({ where: { id }, select: camposPublicos });
}
