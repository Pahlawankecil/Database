const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nota = sequelize.define(
  'Nota',
  {
    nomor_nota: { type: DataTypes.STRING(30), unique: true, allowNull: false },
    jenis_nota: { type: DataTypes.ENUM('kontan', 'hutang'), allowNull: false },
    tanggal: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    pelanggan_id: DataTypes.INTEGER,
    nama_pelanggan_manual: DataTypes.STRING(100),
    total_belanja: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    uang_dp: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    uang_bayar: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    sisa_hutang: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    status_hutang: { type: DataTypes.ENUM('lunas', 'belum_lunas'), defaultValue: 'lunas' },
    keterangan: DataTypes.TEXT,
    created_by: DataTypes.INTEGER,
  },
  { tableName: 'nota', underscored: true, updatedAt: false }
);

module.exports = Nota;
