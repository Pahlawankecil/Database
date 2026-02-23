const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kategori = sequelize.define(
  'Kategori',
  {
    nama_kategori: { type: DataTypes.STRING(50), allowNull: false },
    deskripsi: DataTypes.TEXT,
  },
  { tableName: 'kategori', underscored: true, updatedAt: false }
);

module.exports = Kategori;
