import { Router } from "express";
import * as libroController from "../controllers/libro.controller";
import { validate, validateParams } from "../middlewares/validate.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { idParamSchema, libroCreateSchema, libroUpdateSchema } from "../validations/libro.validation";

const router = Router();

// Los middlewares corren en el orden en que se escriben, antes del controller.
// Lectura: pública. Escritura: authenticate -> authorize -> validateParams -> validate -> controller
// (primero quién sos, después qué podés; recién ahí se miran los datos)
router.get("/", libroController.getAll);
router.get("/:id", validateParams(idParamSchema), libroController.getById);
router.post("/", authenticate, authorize("ADMIN"), validate(libroCreateSchema), libroController.create);
router.put("/:id", authenticate, authorize("ADMIN"), validateParams(idParamSchema), validate(libroUpdateSchema), libroController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), validateParams(idParamSchema), libroController.remove);

export default router;
