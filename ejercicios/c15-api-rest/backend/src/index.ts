import express from "express";
import libroRoutes from "./routes/libro.routes";

const app = express();
// El puerto viene del entorno (.env); 3000 por defecto
const PORT = process.env.PORT ?? 3000;

interface Autor {
  id: number;
  nombre: string;
  nacionalidad: string;
}

const autores: Autor[] = [
  { id: 1, nombre: "Gabriel García Márquez", nacionalidad: "Colombia" },
  { id: 2, nombre: "Julio Cortázar", nacionalidad: "Argentina" },
  { id: 3, nombre: "Jorge Luis Borges", nacionalidad: "Argentina" },
];

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ mensaje: "API de la Librería 🐳" });
});

app.use("/api/libros", libroRoutes);

app.get("/autores", (_req, res) => {
  res.json(autores);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
