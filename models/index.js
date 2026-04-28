const sequelize = require("../config/database");

const Product = require("./Product");
const ProductVariant = require("./ProductVariant");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Customer = require("./Customer");
const User = require("./User");
const Category = require("./Category");
const Business = require("./Business"); 
const Payment = require("./Payment");

const db = {};

db.sequelize = sequelize;

db.Product = Product;
db.ProductVariant = ProductVariant;
db.Order = Order;
db.OrderItem = OrderItem;
db.Customer = Customer;
db.User = User;
db.Category = Category;
db.Business = Business;
db.Payment = Payment;

// associations
require("./associations")(db);

module.exports = db;