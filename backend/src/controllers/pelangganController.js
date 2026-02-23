const { Op } = require('sequelize');
const { Pelanggan, Nota } = require('../models');
const { nextCode } = require('../utils/codeGenerator');
const { logActivity } = require('../utils/activityLogger');

const list = async (req, res) => {
  const q = req.query.q || '';
  const data = await Pelanggan.findAll({ where: { nama: { [Op.like]: `%${q}%` } }, order: [['created_at', 'DESC']] });
  res.json(data);
};

const create = async (req, res) => {
  const kode_pelanggan = await nextCode(Pelanggan, 'kode_pelanggan', 'PLG');
  const payload = { ...req.body, kode_pelanggan, created_by: req.user.id, updated_by: req.user.id };
  const result = await Pelanggan.create(payload);
  await logActivity({ userId: req.user.id, aksi: 'CREATE', tabel: 'pelanggan', recordId: result.id, detail: payload, ip: req.ip });
  res.status(201).json(result);
};

const update = async (req, res) => {
  const item = await Pelanggan.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
  await item.update({ ...req.body, updated_by: req.user.id });
  await logActivity({ userId: req.user.id, aksi: 'UPDATE', tabel: 'pelanggan', recordId: item.id, detail: req.body, ip: req.ip });
  res.json(item);
};

const remove = async (req, res) => {
  const item = await Pelanggan.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });

  const hutang = await Nota.count({ where: { pelanggan_id: item.id, jenis_nota: 'hutang', status_hutang: 'belum_lunas' } });
  if (hutang > 0) return res.status(400).json({ message: 'Pelanggan masih memiliki hutang aktif' });

  await item.destroy();
  await logActivity({ userId: req.user.id, aksi: 'DELETE', tabel: 'pelanggan', recordId: item.id, detail: { nama: item.nama }, ip: req.ip });
  res.json({ message: 'Berhasil dihapus' });
};

module.exports = { list, create, update, remove };
