import { Request, Response } from "express";
import * as libroService from "../services/libro.service";
import { Libro } from "../types/libro.types";

// disponible llega como string en req.query
export function getAll(req: Request, res: Response) {
  const { disponible } = req.query;
  const filtro =
    disponible === "true" ? true : disponible === "false" ? false : undefined;
  res.json(libroService.findAll(filtro));
}

export function getById(req: Request, res: Response) {
  const libro = libroService.findById(Number(req.params.id));
  if (!libro) {
    res.status(404).json({ error: "Libro no encontrado" });
    return;
  }
  res.json(libro);
}

export function create(req: Request, res: Response) {
  const datos: Omit<Libro, "id"> = req.body;
  res.status(201).json(libroService.create(datos));
}

export function update(req: Request, res: Response) {
  const datos: Omit<Libro, "id"> = req.body;
  const libro = libroService.update(Number(req.params.id), datos);
  if (!libro) {
    res.status(404).json({ error: "Libro no encontrado" });
    return;
  }
  res.json(libro);
}

export function remove(req: Request, res: Response) {
  if (!libroService.remove(Number(req.params.id))) {
    res.status(404).json({ error: "Libro no encontrado" });
    return;
  }
  res.status(204).send();
}
