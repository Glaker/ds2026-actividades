import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";

// 4 parámetros: así Express sabe que es un manejador de errores. Va último en index.ts
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Validación (forma del request): el cliente lo arregla cambiando los datos
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: err.issues.map((i) => ({ campo: i.path.join("."), mensaje: i.message })),
    });
  }

  // Constraints de la base
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return res.status(409).json({ error: "Ya existe un registro con ese valor" });
    if (err.code === "P2025") return res.status(404).json({ error: "No encontrado" });
    if (err.code === "P2003") return res.status(409).json({ error: "Hay registros relacionados" });
  }

  // Cualquier otra cosa es problema nuestro: se loguea y no se le muestra el detalle al cliente
  console.error(err);
  return res.status(500).json({ error: "Error interno del servidor" });
};
