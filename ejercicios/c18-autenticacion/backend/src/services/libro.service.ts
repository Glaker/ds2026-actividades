import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { LibroCreate, LibroUpdate } from "../validations/libro.validation";

// include cambia la forma del JSON: estos tipos describen lo que realmente se devuelve
export type LibroConAutor = Prisma.LibroGetPayload<{ include: { autor: true } }>;
export type LibroDetalle = Prisma.LibroGetPayload<{ include: { autor: true; categorias: true } }>;

export async function findAll(disponible?: boolean): Promise<LibroConAutor[]> {
  // disponible undefined: Prisma ignora el filtro y trae todos
  return prisma.libro.findMany({ where: { disponible }, include: { autor: true } });
}

export async function findById(id: number): Promise<LibroDetalle | null> {
  return prisma.libro.findUnique({ where: { id }, include: { autor: true, categorias: true } });
}

// Si autorId no existe, la FK lo rechaza (P2003) y el errorHandler responde 409
export async function create(datos: LibroCreate): Promise<LibroConAutor> {
  return prisma.libro.create({ data: datos, include: { autor: true } });
}

export async function update(id: number, datos: LibroUpdate): Promise<LibroConAutor | null> {
  const existente = await prisma.libro.findUnique({ where: { id } });
  if (!existente) return null;
  return prisma.libro.update({ where: { id }, data: datos, include: { autor: true } });
}

export async function remove(id: number): Promise<boolean> {
  const existente = await prisma.libro.findUnique({ where: { id } });
  if (!existente) return false;
  await prisma.libro.delete({ where: { id } });
  return true;
}
