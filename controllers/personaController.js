import Necesidad from "../models/Necesidad.js";
import Persona from "../models/Persona.js";

const obtenerPersonas = async (req, res) => {
  const personas = await Persona.find().where("creador").equals(req.usuario);
  res.json(personas);
};

const nuevaPersona = async (req, res) => {
  const persona = new Persona(req.body);
  persona.creador = req.usuario._id;

  try {
    const personaAlmacenada = await persona.save();
    res.json(personaAlmacenada);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear la persona' });
  }
};

const obtenerPersona = async (req, res) => {
  const { id } = req.params;

  const persona = await Persona.findById(id);

  if (!persona) {
    const error = new Error(" Persona no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (persona.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(401).json({ msg: error.message });
  }

  // Obtener necesidades de la persona
  const necesidad = await Necesidad.find().where("persona").equals(persona._id);
  res.json({
    persona,
    necesidad,
  });
};

const editarPersona = async (req, res) => {
  const { id } = req.params;

  const persona = await Persona.findById(id);

  if (!persona) {
    const error = new Error(" Persona no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (persona.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(401).json({ msg: error.message });
  }

  persona.rut = req.body.rut || persona.rut;
  persona.nombre = req.body.nombre || persona.nombre;
  persona.direccion = req.body.direccion || persona.direccion;
  persona.descripcion = req.body.descripcion || persona.descripcion;

  try {
    const personaAlmacenada = await persona.save();
    res.json(personaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const eliminarPersona = async (req, res) => {
  const { id } = req.params;

  const persona = await Persona.findById(id);

  if (!persona) {
    const error = new Error("Persona no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (persona.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await persona.deleteOne();
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
  }
};

const asignarAsistente = async (req, res) => {};

const eliminarAsistente = async (req, res) => {};

export {
  obtenerPersonas,
  nuevaPersona,
  obtenerPersona,
  editarPersona,
  eliminarPersona,
  asignarAsistente,
  eliminarAsistente,
};
