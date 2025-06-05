const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const ENCRYPT_KEY = process.env.ENCRYPT_KEY;

exports.register = async (req, res) => {
  try {
    let { email, password, tipo } = req.body;

    tipo = Number(tipo); // Forzar número antes de validar

    // Validar formato de email SOLO si es estudiante
    const emailRegex = /^1001\.\d{7,8}\.ucla@gmail\.com$/;
    if (tipo === 1 && !emailRegex.test(email)) {
      return res.status(400).json({ msg: "Correo no cumple el formato requerido" });
    }

    // Validar formato de contraseña
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!pwdRegex.test(password)) {
      return res.status(400).json({
        msg: "La contraseña debe tener mínimo 8 caracteres, mayúsculas, minúsculas, número y símbolo."
      });
    }

    if (![1, 2].includes(tipo)) {
      return res.status(400).json({ msg: "Tipo debe ser 1 (estudiante) o 2 (profesor)" });
    }

    // Cifrar y hashear el email ANTES de buscar o guardar
    const encryptedEmail = CryptoJS.AES.encrypt(email, ENCRYPT_KEY).toString();
    const emailHash = CryptoJS.SHA256(email).toString();

    // Revisar si el usuario ya existe (buscar por email_hash)
    const userExists = await User.findOne({ email_hash: emailHash });
    if (userExists) {
      return res.status(400).json({ msg: "El usuario ya está registrado" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar usuario
    const newUser = new User({
      email: encryptedEmail,
      email_hash: emailHash,
      password: hashedPassword,
      tipo
    });

    await newUser.save();

    res.status(201).json({ msg: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    if (error.errors) {
      res.status(400).json({ msg: "Error de validación", detail: error.errors });
    } else {
      res.status(500).json({ msg: "Error del servidor", error: error.message });
    }
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hashear el email recibido para buscar en la BD
    const emailHash = CryptoJS.SHA256(email).toString();
    const user = await User.findOne({ email_hash: emailHash });
    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Descifrar email para mostrarlo en respuesta
    const decryptedEmail = CryptoJS.AES.decrypt(user.email, ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);

    res.json({
      msg: "Login exitoso",
      token,
      tipo: user.tipo,
      email: decryptedEmail
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
