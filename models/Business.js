// models/Business.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Business = sequelize.define("Business", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Business;