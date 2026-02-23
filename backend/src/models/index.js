const sequelize = require('../config/database');
const User = require('./User');
const Pelanggan = require('./Pelanggan');
const Kategori = require('./Kategori');
const Barang = require('./Barang');
const Nota = require('./Nota');
const DetailNota = require('./DetailNota');
const RiwayatHutang = require('./RiwayatHutang');
const LogAktivitas = require('./LogAktivitas');
const Pengaturan = require('./Pengaturan');

Kategori.hasMany(Barang, { foreignKey: 'kategori_id' });
Barang.belongsTo(Kategori, { foreignKey: 'kategori_id' });

Pelanggan.hasMany(Nota, { foreignKey: 'pelanggan_id' });
Nota.belongsTo(Pelanggan, { foreignKey: 'pelanggan_id' });

Nota.hasMany(DetailNota, { foreignKey: 'nota_id', as: 'items' });
DetailNota.belongsTo(Nota, { foreignKey: 'nota_id' });

Nota.hasMany(RiwayatHutang, { foreignKey: 'nota_id', as: 'riwayat' });
RiwayatHutang.belongsTo(Nota, { foreignKey: 'nota_id' });

module.exports = {
  sequelize,
  User,
  Pelanggan,
  Kategori,
  Barang,
  Nota,
  DetailNota,
  RiwayatHutang,
  LogAktivitas,
  Pengaturan,
};
