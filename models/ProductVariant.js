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
  satuan: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "product_variants"
});

module.exports = ProductVariant;