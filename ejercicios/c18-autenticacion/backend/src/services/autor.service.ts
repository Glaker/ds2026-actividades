import { prisma } from "../config/prisma";
import { Autor } from "../types/autor.types";
import { AutorCreate, AutorUpdate } from "../validations/autor.validation";

export async function findAll(): Promise<Autor[]> {
  return prisma.autor.findMany();
}

export async function findById(id: number): Promise<Autor | null> {
  return prisma.autor.findUnique({ where: { id } });
}

// nombre repetido: P2002 -> 409
export async function create(datos: AutorCreate): Promise<Autor> {
  return prisma.autor.create({ data: datos });
}

export async function update(id: number, datos: AutorUpdate): Promise<Autor | null> {
  const existente = await prisma.autor.findUnique({ where: { id } });
  if (!existente) return null;
  return prisma.autor.update({ where: { id }, data: datos });
}

// Autor con libros: onDelete Restrict lo impide (P2003) -> 409
export async function remove(id: number): Promise<boolean> {
  const existente = await prisma.autor.findUnique({ where: { id } });
  if (!existente) return false;
  await prisma.autor.delete({ where: { id } });
  return true;
}
