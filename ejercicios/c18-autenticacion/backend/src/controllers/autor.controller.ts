import { Request, Response } from "express";
import * as autorService from "../services/autor.service";
import { AutorCreate, AutorUpdate } from "../validations/autor.validation";

// Los errores los resuelve el errorHandler: Express 5 le manda solo las promesas rechazadas

export async function getAll(_req: Request, res: Response) {
  res.json(await autorService.findAll());
}

export async function getById(req: Request, res: Response) {
  const autor = await autorService.findById(Number(req.params.id));
  if (!autor) {
    return res.status(404).json({ error: "Autor no encontrado" });
  }
  res.json(autor);
}

export async function create(req: Request, res: Response) {
  const datos: AutorCreate = req.body;
  res.status(201).json(await autorService.create(datos));
}

export async function update(req: Request, res: Response) {
  const datos: AutorUpdate = req.body;
  const autor = await autorService.update(Number(req.params.id), datos);
  if (!autor) {
    return res.status(404).json({ error: "Autor no encontrado" });
  }
  res.json(autor);
}

export async function remove(req: Request, res: Response) {
  if (!(await autorService.remove(Number(req.params.id)))) {
    return res.status(404).json({ error: "Autor no encontrado" });
  }
  res.status(204).send();
}
