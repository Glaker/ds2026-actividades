import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

// Valida el body. Si falla, next(error) salta directo al errorHandler (400)
export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) return next(resultado.error);
    // El body limpio (con trim aplicado y sin campos desconocidos) reemplaza al original
    req.body = resultado.data;
    next();
  };

// Valida los params de la URL (:id). No los reemplaza: el controller sigue usando Number()
export const validateParams =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.params);
    if (!resultado.success) return next(resultado.error);
    next();
  };
