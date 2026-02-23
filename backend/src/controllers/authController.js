const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { logActivity } = require('../utils/activityLogger');

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !user.is_active) return res.status(401).json({ message: 'Username/password salah' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Username/password salah' });

  user.last_login = new Date();
  await user.save();

  const token = jwt.sign({ id: user.id, role: user.role, nama_lengkap: user.nama_lengkap }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  await logActivity({ userId: user.id, aksi: 'LOGIN', tabel: 'users', recordId: user.id, detail: { username }, ip: req.ip });
  return res.json({ token, user: { id: user.id, username: user.username, role: user.role, nama_lengkap: user.nama_lengkap } });
};

const me = async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'nama_lengkap', 'role'] });
  res.json(user);
};

module.exports = { login, me };
