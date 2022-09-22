import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

export const signUp = async (req, res) => {

  // Logica de registro (Inicio)

  try {
    // Obtener usuario
    const { email, password, name, phone_number } = req.body;

    // Validando usuario
    if (!(email && password)) {
      return res.status(400).send("Se requiere todo los campos");
    }

    
    const existingUser = await prisma.user.findUnique({ 
      where: {
        email: email
      }
     });

    if (existingUser) {
      return res.status(409).send("Usuario existente.");
    }

    //Cifrado de la contraseña
    let encryptedPassword = await bcrypt.hash(password, 10);

    //Crear usuario en la base de datos
    
    const user = await prisma.user.create({
      data:{
        name,
        phone_number,
        email: email.toLowerCase(),
        password: encryptedPassword,
      }
    });

    // Crear tocken & expira en 1 hora
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    // Guardar el tocken del usuario
    user.token = token;

    // Retorna usuario
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Logica de registro (Fin)
};

export const signIn = async (req, res) => {

  // Logica inicio de sesion (Inicio)
  try {
    // Obtener usuario
    const { email, password } = req.body;

    // Validar usuario
    if (!(email && password)) {
      res.status(400).send("Se requiere todos los campos.");
    }
    // Validar si el usuario ya existe en la bd
    const user = await prisma.user.findUnique({ 
      where: {
        email: email
      }
     });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Crear token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

      // Guardar token
      user.token = token;

      // Usuario
      return res.status(200).json(user);
    }
    return res.status(400).send("Datos incorrectos.");
  } catch (err) {
    console.log(err);
  }
  // Logica de inicio de sesion(Fin)
};