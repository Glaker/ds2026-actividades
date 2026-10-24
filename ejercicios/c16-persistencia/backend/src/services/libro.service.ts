import { Libro } from "../types/libro.types";

const libros: Libro[] = [
  { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", imagen: "/img/portada-1.jpg", precio: 18500, disponible: true },
  { id: 2, titulo: "Rayuela", autor: "Julio Cortázar", imagen: "/img/portada-2.jpg", precio: 15900, disponible: true },
  { id: 3, titulo: "Ficciones", autor: "Jorge Luis Borges", imagen: "/img/portada-3.jpg", precio: 14200, disponible: false },
  { id: 4, titulo: "El túnel", autor: "Ernesto Sabato", imagen: "/img/portada-4.jpg", precio: 12800, disponible: true },
];

// El siguiente al id más alto existente
let proximoId = Math.max(...libros.map((l) => l.id)) + 1;

export function findAll(disponible?: boolean): Libro[] {
  if (disponible === undefined) return libros;
  return libros.filter((l) => l.disponible === disponible);
}

export function findById(id: number): Libro | undefined {
  return libros.find((l) => l.id === id);
}

export function create(datos: Omit<Libro, "id">): Libro {
  const nuevo: Libro = { id: proximoId++, ...datos };
  libros.push(nuevo);
  return nuevo;
}

export function update(id: number, datos: Omit<Libro, "id">): Libro | undefined {
  const indice = libros.findIndex((l) => l.id === id);
  if (indice === -1) return undefined;
  libros[indice] = { id, ...datos };
  return libros[indice];
}

export function remove(id: number): boolean {
  const indice = libros.findIndex((l) => l.id === id);
  if (indice === -1) return false;
  libros.splice(indice, 1);
  return true;
}
