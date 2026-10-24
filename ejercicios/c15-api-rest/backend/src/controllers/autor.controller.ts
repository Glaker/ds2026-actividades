import { Request, Response } from "express";
import * as autorService from "../services/autor.service";
import { Autor } from "../types/autor.types";

export function getAll(_req: Request, res: Response) {
  res.json(autorService.findAll());
}

export function getById(req: Request, res: Response) {
  const autor = autorService.findById(Number(req.params.id));
  if (!autor) {
    res.status(404).json({ error: "Autor no encontrado" });
    return;
  }
  res.json(autor);
}

export function create(req: Request, res: Response) {
  const datos: Omit<Autor, "id"> = req.body;
  res.status(201).json(autorService.create(datos));
}

export function update(req: Request, res: Response) {
  const datos: Omit<Autor, "id"> = req.body;
  const autor = autorService.update(Number(req.params.id), datos);
  if (!autor) {
    res.status(404).json({ error: "Autor no encontrado" });
    return;
  }
  res.json(autor);
}

export function remove(req: Request, res: Response) {
  if (!autorService.remove(Number(req.params.id))) {
    res.status(404).json({ error: "Autor no encontrado" });
    return;
  }
  res.status(204).send();
}
