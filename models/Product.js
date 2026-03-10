const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  nama: { type: DataTypes.STRING, allowNull: false },
  kategori: { type: DataTypes.STRING, allowNull: false },
  satuan: { type: DataTypes.STRING, allowNull: false },
  berat: { type: DataTypes.FLOAT, allowNull: false },
  harga: { type: DataTypes.FLOAT, allowNull: false },
  stok: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  keterangan: { type: DataTypes.TEXT, allowNull: true },
});

module.exports = Product;