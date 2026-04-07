const sequelize = require("../config/database");
const { Order, OrderItem, ProductVariant } = require("../models");

exports.createOrder = async (payload) => {
  const t = await sequelize.transaction();

  try {
    const { customerId, items } = payload;

    if (!customerId || !items || items.length === 0) {
      throw new Error("Invalid data");
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const variant = await ProductVariant.findByPk(item.variantId, { transaction: t });

      if (!variant) throw new Error("Variant not found");

      if (variant.stock < item.quantity) {
        throw new Error(`Stock not enough for variant ${variant.name}`);
      }

      const subtotal = variant.price * item.quantity;
      totalPrice += subtotal;

      orderItems.push({
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice: variant.price,
        subtotal
      });

      variant.stock -= item.quantity;
      await variant.save({ transaction: t });
    }

    const order = await Order.create({
      customerId,
      totalPrice,
      status: "pending"
    }, { transaction: t });

    for (const item of orderItems) {
      item.orderId = order.id;
    }

    await OrderItem.bulkCreate(orderItems, { transaction: t });

    await t.commit();

    return order;

  } catch (err) {
    await t.rollback();
    throw err;
  }
};