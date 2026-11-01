import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { registroSchema, loginSchema } from "../validations/auth.validation";

const router = Router();

// Públicas: para conseguir un token no se puede exigir un token
router.post("/registro", validate(registroSchema), authController.registrar);
router.post("/login", validate(loginSchema), authController.login);
// Cualquier usuario logueado (CLIENTE o ADMIN): solo hace falta saber quién es
router.get("/yo", authenticate, authController.yo);

export default router;
