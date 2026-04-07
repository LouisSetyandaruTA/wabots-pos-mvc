const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Customer = require('./Customer');
const Product = require('./Product');
const ProductVariant = require('./ProductVariant');

Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId' });

ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });

Product.hasMany(ProductVariant, { foreignKey: "productId" });
ProductVariant.belongsTo(Product, { foreignKey: "productId" });