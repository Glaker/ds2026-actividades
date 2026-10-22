import express from "express";

const app = express();
// El puerto viene del entorno (.env); 3000 por defecto
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({ mensaje: "Hola desde la API de la Librería" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
