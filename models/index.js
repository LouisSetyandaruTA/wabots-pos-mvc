const sequelize = require("../config/database");

// Import semua model
const Product = require("./Product");
const ProductVariant = require("./ProductVariant");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Customer = require("./Customer");
const User = require("./User");

// Jalankan associations
require("./associations");

// Export semua model
module.exports = {
  sequelize,
  Product,
  ProductVariant,
  Order,
  OrderItem,
  Customer,
  User
};