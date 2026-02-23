const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pelanggan = sequelize.define(
  'Pelanggan',
  {
    kode_pelanggan: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    nama: { type: DataTypes.STRING(100), allowNull: false },
    alamat: DataTypes.TEXT,
    telepon: DataTypes.STRING(15),
    keterangan: DataTypes.TEXT,
    total_hutang: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
  },
  { tableName: 'pelanggan', underscored: true }
);

module.exports = Pelanggan;
