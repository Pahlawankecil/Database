const { Op } = require('sequelize');
const { Barang, Kategori } = require('../models');
const { nextCode } = require('../utils/codeGenerator');

const list = async (req, res) => {
  const { q = '', kategori_id } = req.query;
  const where = { nama_barang: { [Op.like]: `%${q}%` } };
  if (kategori_id) where.kategori_id = kategori_id;
  const data = await Barang.findAll({ where, include: [{ model: Kategori }], order: [['created_at', 'DESC']] });
  res.json(data);
};

const create = async (req, res) => {
  const kode_barang = await nextCode(Barang, 'kode_barang', 'BRG');
  const payload = { ...req.body, kode_barang, created_by: req.user.id, updated_by: req.user.id };
  const created = await Barang.create(payload);
  res.status(201).json(created);
};

const update = async (req, res) => {
  const item = await Barang.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Barang tidak ditemukan' });
  await item.update({ ...req.body, updated_by: req.user.id });
  res.json(item);
};

const duplicate = async (req, res) => {
  const item = await Barang.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Barang tidak ditemukan' });
  const kode_barang = await nextCode(Barang, 'kode_barang', 'BRG');
  const clone = await Barang.create({ ...item.toJSON(), id: undefined, kode_barang, nama_barang: `${item.nama_barang} Copy` });
  res.status(201).json(clone);
};

const remove = async (req, res) => {
  const item = await Barang.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Barang tidak ditemukan' });
  await item.destroy();
  res.json({ message: 'Berhasil dihapus' });
};

module.exports = { list, create, update, duplicate, remove };
