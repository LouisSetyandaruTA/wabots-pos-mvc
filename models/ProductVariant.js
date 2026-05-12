const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductVariant = sequelize.define("ProductVariant", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  businessId: {
    type: DataTypes.UUID,
    allowNull: false
  },

  nama_variant: {
    type: DataTypes.STRING,
    allowNull: false
  },

  harga: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  stok: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  berat: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      "active",
      "inactive"
    ),
    defaultValue: "active"
  }

}, {
  tableName: "product_variants",
  freezeTableName: true
});

module.exports = ProductVariant;