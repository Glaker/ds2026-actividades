import { Request, Response } from "express";
import * as categoriaService from "../services/categoria.service";
import { CategoriaCreate, CategoriaUpdate } from "../validations/categoria.validation";

// Los errores los resuelve el errorHandler: Express 5 le manda solo las promesas rechazadas

export async function getAll(_req: Request, res: Response) {
  res.json(await categoriaService.findAll());
}

export async function getById(req: Request, res: Response) {
  const categoria = await categoriaService.findById(Number(req.params.id));
  if (!categoria) {
    return res.status(404).json({ error: "Categoría no encontrada" });
  }
  res.json(categoria);
}

export async function create(req: Request, res: Response) {
  const datos: CategoriaCreate = req.body;
  res.status(201).json(await categoriaService.create(datos));
}

export async function update(req: Request, res: Response) {
  const datos: CategoriaUpdate = req.body;
  const categoria = await categoriaService.update(Number(req.params.id), datos);
  if (!categoria) {
    return res.status(404).json({ error: "Categoría no encontrada" });
  }
  res.json(categoria);
}

export async function remove(req: Request, res: Response) {
  if (!(await categoriaService.remove(Number(req.params.id)))) {
    return res.status(404).json({ error: "Categoría no encontrada" });
  }
  res.status(204).send();
}
