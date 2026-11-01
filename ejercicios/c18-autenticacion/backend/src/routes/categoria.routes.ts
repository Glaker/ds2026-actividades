import { Router } from "express";
import * as categoriaController from "../controllers/categoria.controller";
import { validate, validateParams } from "../middlewares/validate.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { categoriaCreateSchema, categoriaUpdateSchema } from "../validations/categoria.validation";
import { idParamSchema } from "../validations/libro.validation";

const router = Router();

// Los middlewares corren en el orden en que se escriben, antes del controller.
// Lectura: pública. Escritura: authenticate -> authorize -> validateParams -> validate -> controller
// (primero quién sos, después qué podés; recién ahí se miran los datos)
router.get("/", categoriaController.getAll);
router.get("/:id", validateParams(idParamSchema), categoriaController.getById);
router.post("/", authenticate, authorize("ADMIN"), validate(categoriaCreateSchema), categoriaController.create);
router.put("/:id", authenticate, authorize("ADMIN"), validateParams(idParamSchema), validate(categoriaUpdateSchema), categoriaController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validateParams(idParamSchema), categoriaController.remove);

export default router;
