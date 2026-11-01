import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import type { Login, Registro } from "../types/auth.types";

// Sin try/catch: los errores (P2002 por email repetido, etc.) los resuelve el errorHandler

export async function registrar(req: Request, res: Response) {
  const datos: Registro = req.body;
  res.status(201).json(await authService.registrar(datos));
}

export async function login(req: Request, res: Response) {
  const datos: Login = req.body;
  const resultado = await authService.login(datos);
  // Mismo mensaje y mismo 401 si el email no existe o si la clave está mal
  if (!resultado) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
  res.json(resultado);
}

export async function yo(req: Request, res: Response) {
  // req.usuario lo cargó authenticate (la ruta no llega acá sin token válido)
  const usuario = await authService.findById(req.usuario!.id);
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.json(usuario);
}
