const sequelize = require("../config/database");

const Product = require("./Product");
const ProductVariant = require("./ProductVariant");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Customer = require("./Customer");
const User = require("./User");

const db = {};

db.sequelize = sequelize;
db.Product = Product;
db.ProductVariant = ProductVariant;
db.Order = Order;
db.OrderItem = OrderItem;
db.Customer = Customer;
db.User = User;

// 🔥 associations
require("./associations")(db);

module.exports = db;