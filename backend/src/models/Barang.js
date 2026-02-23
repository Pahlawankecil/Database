const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Barang = sequelize.define(
  'Barang',
  {
    kode_barang: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    nama_barang: { type: DataTypes.STRING(100), allowNull: false },
    kategori_id: DataTypes.INTEGER,
    harga: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    satuan: { type: DataTypes.ENUM('pcs', 'pack', 'gr'), allowNull: false },
    isi_per_pack: DataTypes.INTEGER,
    keterangan: DataTypes.TEXT,
    stok: { type: DataTypes.INTEGER, defaultValue: 0 },
    stok_minimum: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
  },
  { tableName: 'barang', underscored: true }
);

module.exports = Barang;
