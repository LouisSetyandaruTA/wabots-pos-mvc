module.exports = (db) => {
    const { Order, OrderItem, Customer, Product, ProductVariant } = db;

    Customer.hasMany(Order, { foreignKey: 'customerId' });
    Order.belongsTo(Customer, { foreignKey: 'customerId', as: "customer" });

    Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
    OrderItem.belongsTo(Order, {
        foreignKey: "orderId",
        as: "order"
    });

    OrderItem.belongsTo(ProductVariant, { foreignKey: "variantId", as: "variant" });

    Product.hasMany(ProductVariant, { foreignKey: 'productId', as: "variants" });
    ProductVariant.belongsTo(Product, { foreignKey: 'productId' });

    ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId' });
};