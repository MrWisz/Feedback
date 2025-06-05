const CryptoJS = require('crypto-js');
const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
const User = require('../models/User');

exports.listarFeedbacks = async (req, res) => {
  try {
    // Solo profesores
    if (req.user.tipo !== 2) {
      return res.status(403).json({ msg: "Solo profesores pueden ver feedbacks" });
    }

    const { page = 1, limit = 10 } = req.query;
    const feedbacks = await User.find({ tipo: 1, feedback: { $ne: null } })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('email feedback -_id');

    // Descifrar feedback antes de enviar
    const result = feedbacks.map(doc => ({
      email: CryptoJS.AES.decrypt(doc.email, ENCRYPT_KEY).toString(CryptoJS.enc.Utf8),
      feedback: CryptoJS.AES.decrypt(doc.feedback, ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
