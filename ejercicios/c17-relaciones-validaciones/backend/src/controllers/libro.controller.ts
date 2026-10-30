import { Request, Response } from "express";
import * as libroService from "../services/libro.service";
import { Libro } from "../types/libro.types";

// disponible llega como string en req.query
export async function getAll(req: Request, res: Response) {
  try {
    const { disponible } = req.query;
    const filtro =
      disponible === "true" ? true : disponible === "false" ? false : undefined;
    res.json(await libroService.findAll(filtro));
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const libro = await libroService.findById(Number(req.params.id));
    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    res.json(libro);
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const datos: Omit<Libro, "id"> = req.body;
    res.status(201).json(await libroService.create(datos));
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const datos: Omit<Libro, "id"> = req.body;
    const libro = await libroService.update(Number(req.params.id), datos);
    if (!libro) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    res.json(libro);
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    if (!(await libroService.remove(Number(req.params.id)))) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
