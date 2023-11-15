import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Cuerpo del correo
  const info = await transport.sendMail({
    from: ' "Vulnerables protegidos" <soporte@islademaipo.cl> ',
    to: email,
    subject: "Confirma tu correo",
    text: "Bienvenido al portal Vulnerables Protegidos",
    html: ` <p>Hola, ${nombre} por favor confirma tu cuenta con el siguiente link: </p>

    <a href="${process.env.FRONTEND_URL}/portal/confirmar/${token}">Confirmar cuenta</a>

    <p>Si no creaste esta cuenta, puedes ignorar el mensaje</p>

    <p>Si necesitas ayuda, puedes contactar con el administrador del sistema.</p>
    
    ` 
  })
};

export const emailRecuperar = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Cuerpo del correo
  const info = await transport.sendMail({
    from: ' "Vulnerables protegidos" <soporte@islademaipo.cl> ',
    to: email,
    subject: "Recupera tu cuenta",
    text: "Recuperar contraseña del portal Vulnerables Protegidos",
    html: ` <p>Hola, ${nombre} para restablecer tu contraseña ingresa al siguiente link: </p>

    <a href="${process.env.FRONTEND_URL}/portal/olvide-password/${token}">Restablecer</a>

    <p>Si no solicitaste esto, ignorar el mensaje</p>

    <p>Si necesitas ayuda, puedes contactar con el administrador del sistema.</p>
    
    ` 
  })
};
