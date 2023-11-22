import mongoose, { mongo } from "mongoose";

const necesidadSchema = mongoose.Schema(
  {
    tipoNecesidad: {
      type: String,
      required: true,
      enum: [
        "Acceso a Tecnología Educativa",
        "Acceso a Transporte",
        "Bienestar Emocional y Mental",
        "Conectividad Digital",
        "Cultura y Recreación",
        "Desarrollo Personal",
        "Documentación y Legalidad",
        "Educación",
        "Empleo y Medios de Vida",
        "Equidad de Género",
        "Inclusión Social",
        "Medio Ambiente",
        "Participación Cívica",
        "Protección del Medio Ambiente",
        "Red de Apoyo Social",
        "Salud y Seguridad",
        "Seguridad Alimentaria",
        "Servicios Básicos",
        "Sostenibilidad",
        "Vivienda",
        "Otros (Especifique en descripción)"
      ],
    },
    descripcion: {
      type: String,
      trim: true,
      required: true,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    fechaMaxima: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    prioridad: {
      type: String,
      required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    persona: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Persona",
    },
    completado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario"
    },
    imagen: String,
  },
  {
    timestamps: true,
  }
);

const Necesidad = mongoose.model("Necesidad", necesidadSchema);

export default Necesidad;
