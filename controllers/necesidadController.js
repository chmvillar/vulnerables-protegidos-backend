import Persona from "../models/Persona.js";
import Necesidad from "../models/Necesidad.js";

const agregarNecesidad = async (req, res) => {
  const { persona } = req.body;

  const existePersona = await Persona.findById(persona);

  if (!existePersona) {
    const error = new Error("La persona no existe");
    return res.status(404).json({ msg: error.message });
  }

  console.log(existePersona);

  if (existePersona.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos necesarios.");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const necesidadAlmacenada = await Necesidad.create(req.body);
    res.json(necesidadAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const obtenerNecesidad = async (req, res) => {
  const { id } = req.params;

  const necesidad = await Necesidad.findById(id).populate("persona");

  if (!necesidad) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (necesidad.persona.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  res.json(necesidad);
};

const actualizarNecesidad = async (req, res) => {
    const { id } = req.params;

  const necesidad = await Necesidad.findById(id).populate("persona");

  if (!necesidad) {
    const error = new Error("Tarea no encontrada")
    return res.status(404).json({ msg: error.message })
  }

  if (necesidad.persona.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  necesidad.nombre = req.body.nombre || necesidad.nombre;
  necesidad.descripcion = req.body.descripcion || necesidad.descripcion;
  necesidad.prioridad = req.body.prioridad || necesidad.prioridad;
  necesidad.fechaMaxima = req.body.fechaMaxima || necesidad.fechaMaxima;

  try {
    const necesidadAlmacenada = await necesidad.save();
    res.json(necesidadAlmacenada);
  } catch (error) {
    console.log(error);
  }

};

const eliminarNecesidad = async (req, res) => {
    const { id } = req.params;

    const necesidad = await Necesidad.findById(id).populate("persona");
  
    if (!necesidad) {
      const error = new Error("Tarea no encontrada")
      return res.status(404).json({ msg: error.message })
    }
  
    if (necesidad.persona.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción no válida");
      return res.status(404).json({ msg: error.message });
    }

    try {
        await necesidad.deleteOne();
        res.json({ msg: "Tarea eliminada."})
    } catch (error) {
        console.log(error);
    }
};

const cambiarEstado = async (req, res) => {

};

export {
  agregarNecesidad,
  obtenerNecesidad,
  actualizarNecesidad,
  eliminarNecesidad,
  cambiarEstado,
};
