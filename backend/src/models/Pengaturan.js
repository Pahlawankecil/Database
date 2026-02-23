const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pengaturan = sequelize.define(
  'Pengaturan',
  {
    key: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    value: { type: DataTypes.TEXT, allowNull: false },
    tipe: { type: DataTypes.ENUM('text', 'number', 'boolean', 'json'), allowNull: false },
    keterangan: DataTypes.TEXT,
  },
  { tableName: 'pengaturan', underscored: true, timestamps: false }
);

module.exports = Pengaturan;
