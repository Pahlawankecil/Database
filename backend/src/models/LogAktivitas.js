const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LogAktivitas = sequelize.define(
  'LogAktivitas',
  {
    user_id: DataTypes.INTEGER,
    aksi: DataTypes.STRING(50),
    tabel: DataTypes.STRING(50),
    record_id: DataTypes.INTEGER,
    detail: DataTypes.TEXT,
    ip_address: DataTypes.STRING(45),
  },
  { tableName: 'log_aktivitas', underscored: true, updatedAt: false }
);

module.exports = LogAktivitas;
