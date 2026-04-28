module.exports = (db) => {
    const {
        User,
        Order,
        OrderItem,
        Customer,
        Product,
        ProductVariant,
        Category,
        Business,
        Payment
    } = db;

    // ======================
    // BUSINESS RELATIONS
    // ======================
    Business.hasMany(User, { foreignKey: "businessId" });
    User.belongsTo(Business, { foreignKey: "businessId" });

    Business.hasMany(Product, { foreignKey: "businessId" });
    Product.belongsTo(Business, { foreignKey: "businessId" });

    Business.hasMany(Category, { foreignKey: "businessId" });
    Category.belongsTo(Business, { foreignKey: "businessId" });

    Business.hasMany(Customer, { foreignKey: "businessId" });
    Customer.belongsTo(Business, { foreignKey: "businessId" });

    Business.hasMany(Order, { foreignKey: "businessId" });
    Order.belongsTo(Business, { foreignKey: "businessId" });

    // ======================
    // PRODUCT & CATEGORY
    // ======================
    Category.hasMany(Product, { foreignKey: "categoryId" });
    Product.belongsTo(Category, { foreignKey: "categoryId", as: "Category" });

    Product.hasMany(ProductVariant, {
        foreignKey: "productId",
        as: "variants"
    });
    ProductVariant.belongsTo(Product, {
        foreignKey: "productId",
        as: "Product"
    });

    // ======================
    // ORDER SYSTEM
    // ======================
    Customer.hasMany(Order, { foreignKey: "customerId" });
    Order.belongsTo(Customer, {
        foreignKey: "customerId",
        as: "customer"
    });

    Order.hasMany(OrderItem, {
        foreignKey: "orderId",
        as: "items"
    });

    OrderItem.belongsTo(Order, {
        foreignKey: "orderId",
        as: "order"
    });

    OrderItem.belongsTo(ProductVariant, {
        foreignKey: "variantId",
        as: "variant"
    });

    ProductVariant.hasMany(OrderItem, {
        foreignKey: "variantId"
    });

    Order.hasOne(Payment, { foreignKey: "orderId" });
    Payment.belongsTo(Order, { foreignKey: "orderId" });

    Business.hasMany(Payment, { foreignKey: "businessId" });
    Payment.belongsTo(Business, { foreignKey: "businessId" });
};