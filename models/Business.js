const { DataTypes } = require("sequelize");

const sequelize =
require("../config/database");

const Business = sequelize.define(
  "Business",
  {

    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue:
        DataTypes.UUIDV4
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT
    },

    address: {
      type: DataTypes.TEXT
    },

    phone: {
      type: DataTypes.STRING
    },

    openHours: {
      type: DataTypes.STRING
    },

    faq: {
      type: DataTypes.TEXT
    }

  }
);

module.exports = Business;