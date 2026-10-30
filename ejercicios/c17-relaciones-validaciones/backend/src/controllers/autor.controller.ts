import { Request, Response } from "express";
import * as autorService from "../services/autor.service";
import { Autor } from "../types/autor.types";

export async function getAll(_req: Request, res: Response) {
  try {
    res.json(await autorService.findAll());
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const autor = await autorService.findById(Number(req.params.id));
    if (!autor) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    res.json(autor);
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const datos: Omit<Autor, "id"> = req.body;
    res.status(201).json(await autorService.create(datos));
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const datos: Omit<Autor, "id"> = req.body;
    const autor = await autorService.update(Number(req.params.id), datos);
    if (!autor) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    res.json(autor);
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    if (!(await autorService.remove(Number(req.params.id)))) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
