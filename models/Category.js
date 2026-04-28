const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  businessId: {
    type: DataTypes.UUID,
    allowNull: false
} 
},{
  tableName: "categories",
  timestamps: true
});

module.exports = Category;
