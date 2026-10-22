import type { Libro } from '../types/libro'

// Libros con los que arranca la tienda (los mismos 6 de la C06); el id identifica cada uno en la URL
export const librosIniciales: Libro[] = [
  {
    id: 1,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    imagen: 'https://covers.openlibrary.org/b/id/12627383-M.jpg',
    precio: 18500,
    disponible: true,
  },
  {
    id: 2,
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    imagen: 'https://covers.openlibrary.org/b/id/1047466-M.jpg',
    precio: 15900,
    disponible: true,
  },
  {
    id: 3,
    titulo: 'Ficciones',
    autor: 'Jorge Luis Borges',
    imagen: 'https://covers.openlibrary.org/b/id/10832290-M.jpg',
    precio: 14200,
    disponible: false,
  },
  {
    id: 4,
    titulo: 'El túnel',
    autor: 'Ernesto Sabato',
    imagen: 'https://covers.openlibrary.org/b/id/5517733-M.jpg',
    precio: 12800,
    disponible: true,
  },
  {
    id: 5,
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    imagen: 'https://covers.openlibrary.org/b/id/10708272-M.jpg',
    precio: 9900,
    disponible: true,
  },
  {
    id: 6,
    titulo: '1984',
    autor: 'George Orwell',
    imagen: 'https://covers.openlibrary.org/b/id/9267242-M.jpg',
    precio: 13500,
    disponible: false,
  },
]
