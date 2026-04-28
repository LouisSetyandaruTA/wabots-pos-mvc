const sequelize = require("../config/database");
const { Order, OrderItem, ProductVariant, Customer , Business } = require("../models");
const { Op } = require("sequelize");

exports.getAllOrders = async (businessId, query) => {
  const { search = "", status = "" } = query;

  const where = { businessId };

  // SEARCH
  if (search) {
    where[Op.or] = [
      { id: { [Op.like]: `%${search}%` } },
      { "$customer.name$": { [Op.like]: `%${search}%` } },
      { "$customer.phoneNumber$": { [Op.like]: `%${search}%` } }
    ];
  }

  // FILTER STATUS
  if (status) {
    where.status = status;
  }

  return await Order.findAll({
    where,
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "name", "phoneNumber"]
      },
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: ProductVariant,
            as: "variant"
          }
        ]
      }
    ],
    order: [["createdAt", "DESC"]]
  });
};

const validateVariant = (variant, qty) => {
  if (!variant) throw new Error("Variant tidak ditemukan");
  if (variant.stok < qty) throw new Error("Stok tidak cukup");
};

exports.createOrder = async (payload) => {
  const t = await sequelize.transaction();

  try {
    const { customerId, items, businessId } = payload;

    if (!customerId || !items?.length) {
      throw new Error("Data order tidak valid");
    }

    let totalPrice = 0;

    const order = await Order.create({
      customerId,
      businessId,
      totalPrice: 0,
      status: "pending"
    }, { transaction: t });

    for (const item of items) {
      const variant = await ProductVariant.findByPk(item.variantId, { transaction: t });

      validateVariant(variant, item.quantity);

      const subtotal = variant.harga * item.quantity;
      totalPrice += subtotal;

      await OrderItem.create({
        orderId: order.id,
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice: variant.harga,
        subtotal
      }, { transaction: t });
    }

    await order.update({ totalPrice }, { transaction: t });

    await t.commit();
    return order;

  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.approveOrder = async (orderId) => {
  const order = await Order.findByPk(orderId);

  if (!order) throw new Error("Order tidak ditemukan");

  if (order.status !== "pending") {
    throw new Error("Order hanya bisa di-approve dari status pending");
  }

  order.status = "approved";
  await order.save();

  return order;
};

exports.completePayment = async (orderId) => {
  const t = await sequelize.transaction();

  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: "items"
        }
      ],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!order) throw new Error("Order tidak ditemukan");
    if (order.status === "paid") return order;
    if (order.status !== "approved") throw new Error("Order belum di-approve");

    for (const item of order.items) {
      const variant = await ProductVariant.findByPk(item.variantId, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      validateVariant(variant, item.quantity);

      await variant.update({
        stok: variant.stok - item.quantity
      }, { transaction: t });
    }

    order.status = "paid";
    await order.save({ transaction: t });

    await t.commit();
    return order;

  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.deleteOrder = async (orderId) => {
  const order = await Order.findByPk(orderId);

  if (!order) throw new Error("Order tidak ditemukan");

  if (!["pending", "cancelled"].includes(order.status)) {
    throw new Error("Order tidak bisa dihapus");
  }

  await order.destroy();
};

// exports.getAllOrders = async (businessId, search) => {
//   const where = { businessId };

//   if (search) {
//     where[Op.or] = [
//       { id: { [Op.like]: `%${search}%` } },
//       { "$customer.name$": { [Op.like]: `%${search}%` } },
//       { "$customer.phoneNumber$": { [Op.like]: `%${search}%` } }
//     ];
//   }

//   return await Order.findAll({
//     where,
//     include: [...],
//   });
// };