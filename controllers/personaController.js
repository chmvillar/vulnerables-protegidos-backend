import Persona from "../models/Persona.js";
import Usuario from "../models/Usuario.js";

const obtenerPersonas = async (req, res) => {
  try {
    const personas = await Persona.find({
      $or: [
        { creador: { $in: [req.usuario] } },
        { asignacion: { $in: [req.usuario] } },
      ],
    }).select("-necesidades");

    res.json(personas);
  } catch (error) {
    console.error("Error al obtener personas:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const nuevaPersona = async (req, res) => {
  const persona = new Persona(req.body);
  persona.creador = req.usuario._id;

  try {
    const personaAlmacenada = await persona.save();
    res.json(personaAlmacenada);
  } catch (error) {
    if (error.code === 11000 && error.keyValue.rut) {
      // El código 11000 corresponde a un error de duplicación de un campo único
      // Comprueba si el campo duplicado es el "rut"
      res.status(400).json({ error: "El RUT ya está registrado." });
    } else {
      res.status(500).json({ error: "Error al crear la persona" });
    }
  }
};

const obtenerPersona = async (req, res) => {
  try {
    const { id } = req.params;

    const persona = await Persona.findById(id)
      .populate({
        path: "necesidades",
        populate: {
          path: "completado",
          select: "nombre",
        },
      })
      .populate("asignacion", "nombre email");

    if (!persona) {
      const error = new Error("Persona no encontrada");
      throw error;
    }

    if (
      persona.creador.toString() !== req.usuario._id.toString() &&
      !persona.asignacion.some(
        (asignacion) => asignacion._id.toString() === req.usuario._id.toString()
      )
    ) {
      const error = new Error("Acción no válida");
      throw error;
    }

    res.json(persona);
  } catch (error) {
    res.status(500).json({ msg: `Error: ${error.message}` });
  }
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

const buscarAsistente = async (req, res) => {
  const { nombre } = req.body;
  try {
    const usuarios = await Usuario.find({
      nombre: { $regex: new RegExp(nombre, "i") },
    }).select("-confirmado -createdAt -password -token -updatedAt -__v");

    if (!usuarios || usuarios.length === 0) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msg: error.message });
    }

    res.json(usuarios);
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const asignarAsistente = async (req, res) => {
  const persona = await Persona.findById(req.params.id);

  if (!persona) {
    const error = new Error("Persona no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (persona.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v"
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (persona.creador.toString() === usuario._id.toString()) {
    const error = new Error("El administrador no puede ser asignado.");
    return res.status(404).json({ msg: error.message });
  }

  if (persona.asignacion.includes(usuario._id)) {
    const error = new Error("El usuario ya está asignado.");
    return res.status(404).json({ msg: error.message });
  }

  persona.asignacion.push(usuario._id);
  await persona.save();
  res.json({ msg: "Asistente asignado correctamente." });
};

const eliminarAsistente = async (req, res) => {
  const persona = await Persona.findById(req.params.id);

  if (!persona) {
    const error = new Error("Persona no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (persona.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  persona.asignacion.pull(req.body.id);
  await persona.save();
  res.json({ msg: "Asistente eliminado correctamente." });
};

export {
  obtenerPersonas,
  nuevaPersona,
  obtenerPersona,
  editarPersona,
  eliminarPersona,
  asignarAsistente,
  eliminarAsistente,
  buscarAsistente,
};
