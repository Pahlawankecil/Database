const { Op, fn, col } = require('sequelize');
const { Nota, Pelanggan, Barang } = require('../models');

const startDay = new Date();
startDay.setHours(0, 0, 0, 0);

const summary = async (_req, res) => {
  const totalPenjualanHariIni = (await Nota.sum('total_belanja', { where: { tanggal: { [Op.gte]: startDay } } })) || 0;
  const totalHutangBelumLunas = (await Nota.sum('sisa_hutang', { where: { jenis_nota: 'hutang', status_hutang: 'belum_lunas' } })) || 0;
  const jumlahPelangganAktif = await Pelanggan.count();
  const jumlahBarang = await Barang.count();

  const sales = await Nota.findAll({
    attributes: [[fn('date', col('tanggal')), 'tanggal'], [fn('sum', col('total_belanja')), 'total']],
    where: { tanggal: { [Op.gte]: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) } },
    group: [fn('date', col('tanggal'))],
    order: [[fn('date', col('tanggal')), 'ASC']],
  });

  const pelangganHutang = await Pelanggan.findAll({ where: { total_hutang: { [Op.gt]: 0 } }, order: [['total_hutang', 'DESC']], limit: 10 });

  res.json({ totalPenjualanHariIni, totalHutangBelumLunas, jumlahPelangganAktif, jumlahBarang, sales, pelangganHutang });
};

module.exports = { summary };
