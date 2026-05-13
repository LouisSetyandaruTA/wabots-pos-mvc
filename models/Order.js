const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  businessId: {
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
  },
  deliveryMethod: {
    type: DataTypes.ENUM(
      "pickup",
      "delivery"
    ),
    allowNull: true
  },

  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  fulfillmentStatus: {
    type: DataTypes.ENUM(
      "waiting_choice",
      "waiting_address",
      "ready_pickup",
      "on_delivery",
      "completed"
    ),
    defaultValue: "waiting_choice"
  }
}, {
  tableName: 'orders',
  freezeTableName: true
});

module.exports = Order;