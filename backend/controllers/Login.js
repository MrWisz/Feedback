exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user._id, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};
