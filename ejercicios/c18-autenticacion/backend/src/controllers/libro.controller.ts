import { Request, Response } from "express";
import * as libroService from "../services/libro.service";
import { LibroCreate, LibroUpdate } from "../validations/libro.validation";

// Los errores los resuelve el errorHandler: Express 5 le manda solo las promesas rechazadas

// disponible llega como string en req.query
export async function getAll(req: Request, res: Response) {
  const { disponible } = req.query;
  const filtro =
    disponible === "true" ? true : disponible === "false" ? false : undefined;
  res.json(await libroService.findAll(filtro));
}

export async function getById(req: Request, res: Response) {
  const libro = await libroService.findById(Number(req.params.id));
  if (!libro) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }
  res.json(libro);
}

export async function create(req: Request, res: Response) {
  // El body ya pasó por validate(libroCreateSchema)
  const datos: LibroCreate = req.body;
  res.status(201).json(await libroService.create(datos));
}

export async function update(req: Request, res: Response) {
  const datos: LibroUpdate = req.body;
  const libro = await libroService.update(Number(req.params.id), datos);
  if (!libro) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }
  res.json(libro);
}

export async function remove(req: Request, res: Response) {
  if (!(await libroService.remove(Number(req.params.id)))) {
    return res.status(404).json({ error: "Libro no encontrado" });
  }
  res.status(204).send();
}
