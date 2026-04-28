const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  orderId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  businessId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  customerName: DataTypes.STRING,
  customerPhone: DataTypes.STRING,

  totalPrice: DataTypes.FLOAT,
  paidAmount: DataTypes.FLOAT,

  method: DataTypes.STRING,
  status: DataTypes.STRING,

  midtransResponse: DataTypes.JSON

}, {
  tableName: "payments",
  freezeTableName: true
});

module.exports = Payment;