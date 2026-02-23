const { sequelize, Nota, DetailNota, Barang, Pelanggan, RiwayatHutang, Pengaturan } = require('../models');
const { nextCode } = require('../utils/codeGenerator');

const hitungItems = async (items) => {
  const result = [];
  let total = 0;
  for (const item of items) {
    const barang = await Barang.findByPk(item.barang_id);
    if (!barang) throw new Error('Barang tidak ditemukan');
    const subtotal = Number(barang.harga) * item.jumlah;
    total += subtotal;
    result.push({
      barang_id: barang.id,
      nama_barang_snapshot: barang.nama_barang,
      harga_satuan: barang.harga,
      jumlah: item.jumlah,
      satuan: barang.satuan,
      subtotal,
      keterangan: item.keterangan,
    });
  }
  return { result, total };
};

const createKontan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const nomor_nota = await nextCode(Nota, 'nomor_nota', 'KTN');
    const { result, total } = await hitungItems(req.body.items);
    const kembalian = req.body.uang_bayar - total;
    if (kembalian < 0) throw new Error('Uang bayar kurang');

    const nota = await Nota.create({ ...req.body, nomor_nota, jenis_nota: 'kontan', total_belanja: total, status_hutang: 'lunas', sisa_hutang: 0, created_by: req.user.id }, { transaction: t });
    await DetailNota.bulkCreate(result.map((x) => ({ ...x, nota_id: nota.id })), { transaction: t });
    await t.commit();
    return res.status(201).json({ ...nota.toJSON(), kembalian });
  } catch (error) {
    await t.rollback();
    return res.status(400).json({ message: error.message });
  }
};

const createHutang = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const batas = await Pengaturan.findOne({ where: { key: 'batas_maksimal_hutang' } });
    const pelanggan = await Pelanggan.findByPk(req.body.pelanggan_id);
    if (!pelanggan) throw new Error('Pelanggan tidak ditemukan');

    const nomor_nota = await nextCode(Nota, 'nomor_nota', 'HTG');
    const { result, total } = await hitungItems(req.body.items);
    const sisa_hutang = total - (req.body.uang_dp || 0);

    if (sisa_hutang < 0) throw new Error('DP melebihi total belanja');
    const estimasi = Number(pelanggan.total_hutang) + sisa_hutang;
    if (estimasi > Number(batas?.value || 1000000)) throw new Error('Melebihi batas maksimal hutang pelanggan');

    const nota = await Nota.create({ ...req.body, nomor_nota, jenis_nota: 'hutang', total_belanja: total, sisa_hutang, status_hutang: sisa_hutang === 0 ? 'lunas' : 'belum_lunas', created_by: req.user.id }, { transaction: t });
    await DetailNota.bulkCreate(result.map((x) => ({ ...x, nota_id: nota.id })), { transaction: t });
    await RiwayatHutang.create({ nota_id: nota.id, tanggal_bayar: new Date(), jumlah_bayar: req.body.uang_dp || 0, sisa_sebelum: total, sisa_sesudah: sisa_hutang, metode_bayar: 'tunai', keterangan: 'Hutang awal', created_by: req.user.id }, { transaction: t });

    pelanggan.total_hutang = estimasi;
    await pelanggan.save({ transaction: t });

    await t.commit();
    return res.status(201).json(nota);
  } catch (error) {
    await t.rollback();
    return res.status(400).json({ message: error.message });
  }
};

const detailHutang = async (req, res) => {
  const nota = await Nota.findByPk(req.params.id, {
    include: [
      { model: Pelanggan },
      { model: DetailNota, as: 'items' },
      { model: RiwayatHutang, as: 'riwayat' },
    ],
  });
  if (!nota || nota.jenis_nota !== 'hutang') return res.status(404).json({ message: 'Nota hutang tidak ditemukan' });
  res.json(nota);
};

const bayarHutang = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const nota = await Nota.findByPk(req.params.id, { transaction: t });
    if (!nota || nota.jenis_nota !== 'hutang') throw new Error('Nota hutang tidak ditemukan');
    const bayar = req.body.jumlah_bayar;
    if (bayar > Number(nota.sisa_hutang)) throw new Error('Jumlah bayar melebihi sisa hutang');

    const sisa_sebelum = Number(nota.sisa_hutang);
    const sisa_sesudah = sisa_sebelum - bayar;

    await RiwayatHutang.create({ nota_id: nota.id, tanggal_bayar: req.body.tanggal_bayar || new Date(), jumlah_bayar: bayar, sisa_sebelum, sisa_sesudah, metode_bayar: req.body.metode_bayar, keterangan: req.body.keterangan, created_by: req.user.id }, { transaction: t });

    nota.sisa_hutang = sisa_sesudah;
    nota.status_hutang = sisa_sesudah === 0 ? 'lunas' : 'belum_lunas';
    await nota.save({ transaction: t });

    const pelanggan = await Pelanggan.findByPk(nota.pelanggan_id, { transaction: t });
    pelanggan.total_hutang = Math.max(0, Number(pelanggan.total_hutang) - bayar);
    await pelanggan.save({ transaction: t });

    await t.commit();
    res.json({ message: 'Pembayaran berhasil', sisa_hutang: sisa_sesudah, status_hutang: nota.status_hutang });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createKontan, createHutang, detailHutang, bayarHutang };
