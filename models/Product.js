const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nama: { type: DataTypes.STRING, allowNull: false },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
businessId: {
  type: DataTypes.UUID,
  allowNull: false
},
  satuan: { type: DataTypes.STRING, allowNull: false },
  berat: { type: DataTypes.FLOAT, allowNull: false },
  keterangan: { type: DataTypes.TEXT, allowNull: true },
  status: {
  type: DataTypes.ENUM(
    "active",
    "inactive"
  ),
  defaultValue: "active"
},
}, {
  tableName: 'products',
  freezeTableName: true
});

module.exports = Product;