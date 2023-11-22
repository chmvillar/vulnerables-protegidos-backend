import Persona from "../models/Persona.js";
import Necesidad from "../models/Necesidad.js";

const agregarNecesidad = async (req, res) => {
  const { persona } = req.body;

  const existePersona = await Persona.findById(persona);

  if (!existePersona) {
    const error = new Error("La persona no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const necesidadAlmacenada = await Necesidad.create(req.body);
    existePersona.necesidades.push(necesidadAlmacenada._id);
    await existePersona.save();
    res.json(necesidadAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const obtenerNecesidad = async (req, res) => {
  const { id } = req.params;

  try {
    const necesidad = await Necesidad.findById(id).populate("persona").sort({ fechaMaxima: -1 });

    if (!necesidad) {
      const error = new Error("Tarea no encontrada");
      return res.status(404).json({ msg: error.message });
    }

    if (necesidad.persona.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción no válida");
      return res.status(404).json({ msg: error.message });
    }

    res.json(necesidad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};


const actualizarNecesidad = async (req, res) => {
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

  necesidad.tipoNecesidad = req.body.tipoNecesidad || necesidad.tipoNecesidad;
  necesidad.descripcion = req.body.descripcion || necesidad.descripcion;
  necesidad.prioridad = req.body.prioridad || necesidad.prioridad;
  necesidad.fechaMaxima = req.body.fechaMaxima || necesidad.fechaMaxima;
  necesidad.imagen = req.body.imagen || necesidad.imagen;

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
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (necesidad.persona.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const persona = await Persona.findById(necesidad.persona);
    persona.necesidades.pull(necesidad._id);

    await Promise.allSettled([
      await persona.save(),
      await necesidad.deleteOne(),
    ]);

    res.json({ msg: "Tarea eliminada." });
  } catch (error) {
    console.log(error);
  }
};

const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  const necesidad = await Necesidad.findById(id).populate("persona");

  if (!necesidad) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (
    necesidad.persona.creador.toString() !== req.usuario._id.toString() &&
    !necesidad.persona.asignacion.some(
      (asignacion) => asignacion._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  necesidad.estado = !necesidad.estado;
  necesidad.completado = req.usuario._id
  await necesidad.save();
  res.json(necesidad);
};

export {
  agregarNecesidad,
  obtenerNecesidad,
  actualizarNecesidad,
  eliminarNecesidad,
  cambiarEstado,
};
