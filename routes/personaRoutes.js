import express from "express";

import {
  obtenerPersonas,
  nuevaPersona,
  obtenerPersona,
  editarPersona,
  eliminarPersona,
  buscarAsistente,
  asignarAsistente,
  eliminarAsistente,
} from "../controllers/personaController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, obtenerPersonas).post(checkAuth, nuevaPersona);

router
    .route("/:id")
    .get(checkAuth, obtenerPersona)
    .put(checkAuth, editarPersona)
    .delete(checkAuth, eliminarPersona);

router.post("/asistentes", checkAuth, buscarAsistente)
router.post("/asistentes/:id", checkAuth, asignarAsistente);
router.post("/eliminar-asistente/:id", checkAuth, eliminarAsistente);

export default router;
