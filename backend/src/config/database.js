const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = process.env.DB_PATH || './database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(dbPath),
  logging: false,
});

module.exports = sequelize;
