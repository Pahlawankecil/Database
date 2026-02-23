const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetailNota = sequelize.define(
  'DetailNota',
  {
    nota_id: DataTypes.INTEGER,
    barang_id: DataTypes.INTEGER,
    nama_barang_snapshot: DataTypes.STRING(100),
    harga_satuan: DataTypes.DECIMAL(15, 2),
    jumlah: DataTypes.INTEGER,
    satuan: { type: DataTypes.ENUM('pcs', 'pack', 'gr') },
    subtotal: DataTypes.DECIMAL(15, 2),
    keterangan: DataTypes.TEXT,
  },
  { tableName: 'detail_nota', underscored: true, timestamps: false }
);

module.exports = DetailNota;
