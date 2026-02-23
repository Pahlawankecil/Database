const { Kategori } = require('../models');

const list = async (_req, res) => res.json(await Kategori.findAll({ order: [['nama_kategori', 'ASC']] }));
const create = async (req, res) => res.status(201).json(await Kategori.create(req.body));
const update = async (req, res) => {
  const item = await Kategori.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
  await item.update(req.body);
  res.json(item);
};
const remove = async (req, res) => {
  const item = await Kategori.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
  await item.destroy();
  res.json({ message: 'Berhasil dihapus' });
};

module.exports = { list, create, update, remove };
