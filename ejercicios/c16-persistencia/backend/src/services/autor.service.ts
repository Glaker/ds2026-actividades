import { Autor } from "../types/autor.types";

const autores: Autor[] = [
  { id: 1, nombre: "Gabriel García Márquez", nacionalidad: "Colombia" },
  { id: 2, nombre: "Julio Cortázar", nacionalidad: "Argentina" },
  { id: 3, nombre: "Jorge Luis Borges", nacionalidad: "Argentina" },
];

// El siguiente al id más alto existente
let proximoId = Math.max(...autores.map((a) => a.id)) + 1;

export function findAll(): Autor[] {
  return autores;
}

export function findById(id: number): Autor | undefined {
  return autores.find((a) => a.id === id);
}

export function create(datos: Omit<Autor, "id">): Autor {
  const nuevo: Autor = { id: proximoId++, ...datos };
  autores.push(nuevo);
  return nuevo;
}

export function update(id: number, datos: Omit<Autor, "id">): Autor | undefined {
  const indice = autores.findIndex((a) => a.id === id);
  if (indice === -1) return undefined;
  autores[indice] = { id, ...datos };
  return autores[indice];
}

export function remove(id: number): boolean {
  const indice = autores.findIndex((a) => a.id === id);
  if (indice === -1) return false;
  autores.splice(indice, 1);
  return true;
}
