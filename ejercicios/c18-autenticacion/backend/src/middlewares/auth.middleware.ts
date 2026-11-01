import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import type { PayloadToken } from "../types/auth.types";

// Autenticación: ¿quién sos? Si no se puede saber -> 401
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Falta el token" });
  }

  // try/catch legítimo: jwt.verify es síncrono y tira error si el token no sirve.
  // (La regla de "cero try/catch" es para los controllers.)
  try {
    // verify chequea la firma con el secret y que no esté vencido. decode solo leería.
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as PayloadToken;
    req.usuario = { id: payload.id, rol: payload.rol };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Autorización: ¿qué podés hacer? Ya sé quién sos; si tu rol no alcanza -> 403.
// Recibe los roles permitidos y devuelve el middleware (igual que validate(schema))
export const authorize =
  (...roles: Array<"ADMIN" | "CLIENTE">) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ error: "No autenticado" });
    }
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: "No tenés permiso para esta operación" });
    }
    next();
  };
