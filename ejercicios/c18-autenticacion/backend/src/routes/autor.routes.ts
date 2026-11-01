import { Router } from "express";
import * as autorController from "../controllers/autor.controller";
import { validate, validateParams } from "../middlewares/validate.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { autorCreateSchema, autorUpdateSchema } from "../validations/autor.validation";
import { idParamSchema } from "../validations/libro.validation";

const router = Router();

// Los middlewares corren en el orden en que se escriben, antes del controller.
// Lectura: pública. Escritura: authenticate -> authorize -> validateParams -> validate -> controller
// (primero quién sos, después qué podés; recién ahí se miran los datos)
router.get("/", autorController.getAll);
router.get("/:id", validateParams(idParamSchema), autorController.getById);
router.post("/", authenticate, authorize("ADMIN"), validate(autorCreateSchema), autorController.create);
router.put("/:id", authenticate, authorize("ADMIN"), validateParams(idParamSchema), validate(autorUpdateSchema), autorController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validateParams(idParamSchema), autorController.remove);

export default router;
