import mongoose from "mongoose";

const personaSchema = mongoose.Schema({
  rut: {
    type: String,
    trim: true,
    required: true,
  },
  nombre: {
    type: String,
    trim: true,
    required: true,
  },
  direccion: {
    type: String,
    trim: true,
    required: true,
  },
  descripcion: {
    type: String,
    trim: true,
    required: true,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now(),
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  asignacion: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  ],
}, {
    timestamps: true,
});

const Persona = mongoose.model("Persona", personaSchema);

export default Persona;