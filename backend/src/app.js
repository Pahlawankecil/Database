const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const pelangganRoutes = require('./routes/pelangganRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const barangRoutes = require('./routes/barangRoutes');
const notaRoutes = require('./routes/notaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/pelanggan', pelangganRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/barang', barangRoutes);
app.use('/api/nota', notaRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

module.exports = app;
