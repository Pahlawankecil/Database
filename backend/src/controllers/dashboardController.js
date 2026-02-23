const { Op, fn, col } = require('sequelize');
const { Nota, Pelanggan, Barang } = require('../models');

const summary = async (_req, res) => {
  const startDay = new Date();
  startDay.setHours(0, 0, 0, 0);

  const totalPenjualanHariIni = (await Nota.sum('total_belanja', { where: { tanggal: { [Op.gte]: startDay } } })) || 0;
  const totalHutangBelumLunas = (await Nota.sum('sisa_hutang', { where: { jenis_nota: 'hutang', status_hutang: 'belum_lunas' } })) || 0;
  const jumlahPelangganAktif = await Pelanggan.count();
  const jumlahBarang = await Barang.count();
  const stokKritis = await Barang.count({ where: { stok: { [Op.lte]: col('stok_minimum') } } });

  const sales = await Nota.findAll({
    attributes: [[fn('date', col('tanggal')), 'tanggal'], [fn('sum', col('total_belanja')), 'total']],
    where: { tanggal: { [Op.gte]: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) } },
    group: [fn('date', col('tanggal'))],
    order: [[fn('date', col('tanggal')), 'ASC']],
  });

  const pelangganHutang = await Pelanggan.findAll({ where: { total_hutang: { [Op.gt]: 0 } }, order: [['total_hutang', 'DESC']], limit: 10 });

  const recentTransaksiRaw = await Nota.findAll({
    attributes: ['id', 'nomor_nota', 'jenis_nota', 'status_hutang', 'total_belanja', 'tanggal', 'nama_pelanggan_manual'],
    include: [{ model: Pelanggan, attributes: ['nama'] }],
    order: [['tanggal', 'DESC']],
    limit: 8,
  });

  const recentTransaksi = recentTransaksiRaw.map((x) => ({
    id: x.id,
    nomor_nota: x.nomor_nota,
    jenis_nota: x.jenis_nota,
    status: x.jenis_nota === 'kontan' ? 'Lunas' : x.status_hutang === 'lunas' ? 'Lunas' : 'Hutang',
    nominal: x.total_belanja,
    tanggal: x.tanggal,
    pelanggan: x.Pelanggan?.nama || x.nama_pelanggan_manual || 'Pelanggan Umum',
  }));

  res.json({
    totalPenjualanHariIni,
    totalHutangBelumLunas,
    jumlahPelangganAktif,
    jumlahBarang,
    stokKritis,
    sales,
    pelangganHutang,
    recentTransaksi,
  });
};

module.exports = { summary };
