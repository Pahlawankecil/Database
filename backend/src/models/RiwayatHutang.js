const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RiwayatHutang = sequelize.define(
  'RiwayatHutang',
  {
    nota_id: DataTypes.INTEGER,
    tanggal_bayar: { type: DataTypes.DATE, allowNull: false },
    jumlah_bayar: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    sisa_sebelum: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    sisa_sesudah: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    metode_bayar: { type: DataTypes.ENUM('tunai', 'transfer'), allowNull: false },
    keterangan: DataTypes.TEXT,
    created_by: DataTypes.INTEGER,
  },
  { tableName: 'riwayat_hutang', underscored: true, updatedAt: false }
);

module.exports = RiwayatHutang;
