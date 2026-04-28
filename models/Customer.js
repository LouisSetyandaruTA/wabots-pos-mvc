const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define("Customer", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  businessId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: "customers",
  freezeTableName: true,
  indexes: [
    {
      unique: true,
      fields: ["phoneNumber", "businessId"]
    }
  ]
});

module.exports = Customer;