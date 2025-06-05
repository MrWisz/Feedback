const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando:", err));

// Rutas de autenticación: /api/auth/register y /api/auth/login
app.use('/api/auth', authRoutes);

// Rutas de feedback: /api/feedback
app.use('/api/feedback', feedbackRoutes);

// ----------- Servir el frontend (React/Vite build) -------------------
app.use(express.static(path.join(__dirname, "public")));

// Para cualquier ruta que no sea API, sirve index.html del frontend
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith('/api/')) return res.status(404).json({ msg: "Not found" });
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// ---------------------------------------------------------------------

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
