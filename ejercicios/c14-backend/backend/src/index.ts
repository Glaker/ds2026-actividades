import express from "express";

const app = express();
// El puerto viene del entorno (.env); 3000 por defecto
const PORT = process.env.PORT ?? 3000;

// Misma forma que frontend/src/types/libro.ts
interface Libro {
  id: number;
  titulo: string;
  autor: string;
  imagen: string;
  precio: number;
  disponible: boolean;
}

interface Autor {
  id: number;
  nombre: string;
  nacionalidad: string;
}

const libros: Libro[] = [
  { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", imagen: "/img/portada-1.jpg", precio: 18500, disponible: true },
  { id: 2, titulo: "Rayuela", autor: "Julio Cortázar", imagen: "/img/portada-2.jpg", precio: 15900, disponible: true },
  { id: 3, titulo: "Ficciones", autor: "Jorge Luis Borges", imagen: "/img/portada-3.jpg", precio: 14200, disponible: false },
  { id: 4, titulo: "El túnel", autor: "Ernesto Sabato", imagen: "/img/portada-4.jpg", precio: 12800, disponible: true },
];

const autores: Autor[] = [
  { id: 1, nombre: "Gabriel García Márquez", nacionalidad: "Colombia" },
  { id: 2, nombre: "Julio Cortázar", nacionalidad: "Argentina" },
  { id: 3, nombre: "Jorge Luis Borges", nacionalidad: "Argentina" },
];

app.get("/", (_req, res) => {
  res.json({ mensaje: "API de la Librería 🐳" });
});

// GET /libros?disponible=true|false  (req.query siempre llega como string)
app.get("/libros", (req, res) => {
  const { disponible } = req.query;
  if (disponible === "true" || disponible === "false") {
    res.json(libros.filter((l) => l.disponible === (disponible === "true")));
    return;
  }
  res.json(libros);
});

app.get("/autores", (_req, res) => {
  res.json(autores);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
