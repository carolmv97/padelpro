// controllers/authController.js
const User = require("../models/User");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");

// Helper para generar el token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definida en las variables de entorno");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Usuario ya existe" });

    const user = new User({ name, email, password });
    await user.save();

    const profile = new Profile({
      user: user._id,
      level: 0,
      style: null,
      skillAverages: {},
    });
    await profile.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      userId: user._id,
      name: user.name,
      message: "Usuario registrado con éxito",
    });
  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(500).json({ message: error.message || "Error al registrar usuario" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      userId: user._id,
      name: user.name,
      message: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: error.message || "Error al iniciar sesión" });
  }
};

exports.getSession = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No autorizado, no hay token' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está definida");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    res.status(401).json({ message: 'No autorizado, token inválido' });
  }
};

