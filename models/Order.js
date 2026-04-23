const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "paid", "cancelled"),
    defaultValue: "pending"
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'orders',
  freezeTableName: true
});

module.exports = Order;