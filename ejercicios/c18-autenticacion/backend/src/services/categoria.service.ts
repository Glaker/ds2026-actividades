import { prisma } from "../config/prisma";
import { Categoria } from "../types/categoria.types";
import { CategoriaCreate, CategoriaUpdate } from "../validations/categoria.validation";

export async function findAll(): Promise<Categoria[]> {
  return prisma.categoria.findMany();
}

export async function findById(id: number): Promise<Categoria | null> {
  return prisma.categoria.findUnique({ where: { id } });
}

// nombre repetido: P2002 -> 409
export async function create(datos: CategoriaCreate): Promise<Categoria> {
  return prisma.categoria.create({ data: datos });
}

export async function update(id: number, datos: CategoriaUpdate): Promise<Categoria | null> {
  const existente = await prisma.categoria.findUnique({ where: { id } });
  if (!existente) return null;
  return prisma.categoria.update({ where: { id }, data: datos });
}

// N:M implícita: al borrar la categoría se borran sus filas de _CategoriaToLibro (CASCADE), no los libros
export async function remove(id: number): Promise<boolean> {
  const existente = await prisma.categoria.findUnique({ where: { id } });
  if (!existente) return false;
  await prisma.categoria.delete({ where: { id } });
  return true;
}
