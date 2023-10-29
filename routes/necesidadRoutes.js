import express from "express";

import {
  agregarNecesidad,
  obtenerNecesidad,
  actualizarNecesidad,
  eliminarNecesidad,
  cambiarEstado,
} from "../controllers/necesidadController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", checkAuth, agregarNecesidad);
router
  .route("/:id")
  .get(checkAuth, obtenerNecesidad)
  .put(checkAuth, actualizarNecesidad)
  .delete(checkAuth, eliminarNecesidad);

router.post("/estado/:id", checkAuth, cambiarEstado);

export default router;