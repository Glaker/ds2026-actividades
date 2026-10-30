import { prisma } from "../config/prisma";
import { Libro } from "../types/libro.types";

export async function findAll(disponible?: boolean): Promise<Libro[]> {
  // Sin filtro, where vacío: trae todos
  return prisma.libro.findMany({
    where: disponible === undefined ? {} : { disponible },
  });
}

export async function findById(id: number): Promise<Libro | null> {
  return prisma.libro.findUnique({ where: { id } });
}

export async function create(datos: Omit<Libro, "id">): Promise<Libro> {
  return prisma.libro.create({ data: datos });
}

export async function update(id: number, datos: Omit<Libro, "id">): Promise<Libro | null> {
  const existente = await prisma.libro.findUnique({ where: { id } });
  if (!existente) return null;
  return prisma.libro.update({ where: { id }, data: datos });
}

export async function remove(id: number): Promise<boolean> {
  const existente = await prisma.libro.findUnique({ where: { id } });
  if (!existente) return false;
  await prisma.libro.delete({ where: { id } });
  return true;
}
