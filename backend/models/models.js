const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tipo: { type: Number, required: true }, // 1: estudiante, 2: profesor
  feedback: { type: String, default: null }
});

module.exports = mongoose.model("User", userSchema);
