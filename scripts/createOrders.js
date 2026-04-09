require("dotenv").config();
const { sequelize, Order, OrderItem, Customer, ProductVariant } = require("../models");

(async () => {
  const t = await sequelize.transaction();

  try {
    await sequelize.sync();

    const customer = await Customer.findOne();
    if (!customer) throw new Error("Customer tidak ada");

    const variants = await ProductVariant.findAll({ limit: 2 });
    if (variants.length < 2) throw new Error("Variant tidak cukup");

    let totalPrice = 0;
    const items = [];

    for (const v of variants) {
      const qty = 2;

      if (v.stok < qty) throw new Error("Stok tidak cukup");

      const subtotal = v.harga * qty;
      totalPrice += subtotal;

      items.push({
        variantId: v.id,
        quantity: qty,
        unitPrice: v.harga,
        subtotal
      });

      // 🔥 potong stok
      v.stok -= qty;
      await v.save({ transaction: t });
    }

    const order = await Order.create({
      customerId: customer.id,
      totalPrice,
      status: "pending"
    }, { transaction: t });

    for (const item of items) {
      item.orderId = order.id;
    }

    await OrderItem.bulkCreate(items, { transaction: t });

    await t.commit();

    console.log("✅ Order created");
    process.exit();

  } catch (err) {
    await t.rollback();
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();