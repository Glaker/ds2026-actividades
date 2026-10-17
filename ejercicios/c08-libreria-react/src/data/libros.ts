// Forma de cada libro del listado
export type Libro = {
  id: number
  titulo: string
  autor: string
  imagen: string
}

// Libros destacados de la home (los mismos 6 de la C06)
export const librosDestacados: Libro[] = [
  {
    id: 1,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    imagen: 'https://covers.openlibrary.org/b/id/12627383-M.jpg',
  },
  {
    id: 2,
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    imagen: 'https://covers.openlibrary.org/b/id/1047466-M.jpg',
  },
  {
    id: 3,
    titulo: 'Ficciones',
    autor: 'Jorge Luis Borges',
    imagen: 'https://covers.openlibrary.org/b/id/10832290-M.jpg',
  },
  {
    id: 4,
    titulo: 'El túnel',
    autor: 'Ernesto Sabato',
    imagen: 'https://covers.openlibrary.org/b/id/5517733-M.jpg',
  },
  {
    id: 5,
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    imagen: 'https://covers.openlibrary.org/b/id/10708272-M.jpg',
  },
  {
    id: 6,
    titulo: '1984',
    autor: 'George Orwell',
    imagen: 'https://covers.openlibrary.org/b/id/9267242-M.jpg',
  },
]
