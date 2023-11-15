import mongoose, { mongo } from "mongoose";

const necesidadSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

const Necesidad = mongoose.model("Necesidad", necesidadSchema);

export default Necesidad;
