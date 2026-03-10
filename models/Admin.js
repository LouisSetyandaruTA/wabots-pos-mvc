const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Admin = db.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'admin',
  },
}, {
  tableName: 'admins',
  timestamps: true,
});

module.exports = Admin;