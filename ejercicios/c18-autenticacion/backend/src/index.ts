import express from "express";
import { z } from "zod";
import libroRoutes from "./routes/libro.routes";
import autorRoutes from "./routes/autor.routes";
import categoriaRoutes from "./routes/categoria.routes";
import { errorHandler } from "./middlewares/error.middleware";

// Mensajes de Zod en español para los errores sin mensaje propio (p. ej. tipo incorrecto)
z.config(z.locales.es());

const app = express();
// El puerto viene del entorno (.env); 3000 por defecto
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ mensaje: "API de la Librería 🐳" });
});

app.use("/api/libros", libroRoutes);
app.use("/api/autores", autorRoutes);
app.use("/api/categorias", categoriaRoutes);

// Último, después de todas las rutas: recibe todo lo que llegue por next(error)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
