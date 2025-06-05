const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback'); // <-- Agregado

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
