import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRecuperar } from "../helpers/email.js";

const registrar = async (req, res) => {
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save();

    // Enviar email de confirmación
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({ msg: "¡Notifique a la persona para confirmar su cuenta!" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("Esta cuenta no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si el usuario está registrado
  if (!usuario.confirmado) {
    const error = new Error("Su cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar la contraseña
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("La contraseña es incorrecta");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioconfirmar = await Usuario.findOne({ token });

  if (!usuarioconfirmar) {
    const error = new Error("El token no es válido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioconfirmar.confirmado = true;
    usuarioconfirmar.token = "";
    await usuarioconfirmar.save();
    res.json({ msg: "Inicie sesión con su cuenta" });
  } catch (error) {
    console.log(error);
  }
};

const recuperarPassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("Esta cuenta no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();

    // Enviar email de recuperación
    emailRecuperar({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });

    res.json({
      msg: "Hemos enviado un correo con las instrucciones para recuperar tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

const tokenRecuperarPassword = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token válido!" });
  } else {
    const error = new Error("Token no válido!");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "Contraseña cambiada correctamente!" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no válido!");
    return res.status(404).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;

  res.json(usuario);
};

export {
  registrar,
  autenticar,
  confirmar,
  recuperarPassword,
  tokenRecuperarPassword,
  nuevoPassword,
  perfil,
};
