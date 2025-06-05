const User = require('../models/User');
const CryptoJS = require('crypto-js');

const ENCRYPT_KEY = process.env.ENCRYPT_KEY;

// Enviar feedback (solo estudiante, solo una vez)
exports.enviarFeedback = async (req, res) => {
  try {
    // Solo estudiantes
    if (req.user.tipo !== 1) {
      return res.status(403).json({ msg: "Solo los estudiantes pueden enviar feedback" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    if (user.feedback) {
      return res.status(400).json({ msg: "Ya enviaste feedback" });
    }

    const { feedback } = req.body;
    if (!feedback || typeof feedback !== "string" || feedback.length < 5) {
      return res.status(400).json({ msg: "El feedback debe tener al menos 5 caracteres" });
    }

    // Cifrar el feedback antes de guardar
    const encryptedFeedback = CryptoJS.AES.encrypt(feedback, ENCRYPT_KEY).toString();
    user.feedback = encryptedFeedback;
    await user.save();

    res.json({ msg: "Feedback enviado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Listar feedbacks (solo profesor, descifrando datos)
exports.listarFeedbacks = async (req, res) => {
  try {
    if (req.user.tipo !== 2) {
      return res.status(403).json({ msg: "Solo profesores pueden ver feedbacks" });
    }

    const { page = 1, limit = 10 } = req.query;
    const feedbacks = await User.find({ tipo: 1, feedback: { $ne: null } })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('feedback -_id'); 

    const result = feedbacks.map(doc => ({
      feedback: CryptoJS.AES.decrypt(doc.feedback, ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

exports.miFeedback = async (req, res) => {
  try {
    if (req.user.tipo !== 1) return res.status(403).json({ msg: "Solo estudiantes" });
    const user = await User.findById(req.user.id);
    res.json({ feedback: user.feedback });
  } catch (err) {
    res.status(500).json({ msg: "Error del servidor" });
  }
};
