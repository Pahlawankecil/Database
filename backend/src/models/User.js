const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    nama_lengkap: { type: DataTypes.STRING(100), allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'kasir'), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    last_login: DataTypes.DATE,
  },
  { tableName: 'users', underscored: true }
);

module.exports = User;
