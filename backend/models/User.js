const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },           // cifrado AES
  email_hash: { type: String, required: true, unique: true }, // hash SHA256
  password: { type: String, required: true },
  tipo: { type: Number, required: true },
  feedback: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);
