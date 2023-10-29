import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import personaRoutes from "./routes/personaRoutes.js";
import necesidadRoutes from "./routes/necesidadRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

// Configurar cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de cors"));
    }
  },
};

app.use(cors(corsOptions));

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/necesidades", necesidadRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor: ${PORT}`);
});
