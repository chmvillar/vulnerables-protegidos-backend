import express from "express";
const router = express.Router();

import {
  registrar,
  autenticar,
  confirmar,
  recuperarPassword,
  tokenRecuperarPassword,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

// Autenticación, registro y confirmación de usuarios
router.post("/", registrar); // Crear nuevo usuario
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", recuperarPassword);
router.route("/olvide-password/:token").get(tokenRecuperarPassword).post(nuevoPassword);

router.get("/perfil", checkAuth, perfil)
export default router;
