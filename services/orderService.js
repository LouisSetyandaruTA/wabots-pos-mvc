const sequelize = require("../config/database");
const { Order, OrderItem, ProductVariant, Customer } = require("../models");

exports.getAllOrders = async (userId) => {
  const orders = await Order.findAll({
    where: {
      userId
    },
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

  return orders;
};

exports.createOrder = async (payload) => {
  const t = await sequelize.transaction();

  try {
    const { customerId, items, userId } = payload;

    if (!customerId || !items || items.length === 0) {
      throw new Error("Data order tidak valid");
    }

    let totalPrice = 0;

    // 1. create order (PENDING)
    const order = await Order.create({
      customerId,
      userId,
      totalPrice: 0,
      status: "pending",
      
    }, { transaction: t });

    for (const item of items) {
      const variant = await ProductVariant.findByPk(item.variantId, { transaction: t });

      if (!variant) {
        throw new Error(`Variant ID ${item.variantId} tidak valid`);
      }

      if (variant.stok < item.quantity) {
        throw new Error(`Stok tidak cukup untuk ${variant.nama_variant}`);
      }

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
      as: "items",
      include: [
        {
          model: ProductVariant,
          as: "variant"
        }
      ]
    }
  ],
  transaction: t
});

    if (!order) throw new Error("Order tidak ditemukan");

    if (order.status !== "approved") {
      throw new Error("Order belum di-approve");
    }

    if (order.status === "paid") {
      throw new Error("Order sudah dibayar");
    }

    for (const item of order.items) {
      const variant = await ProductVariant.findByPk(item.variantId, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!variant) throw new Error("Variant tidak ditemukan");

      if (variant.stok < item.quantity) {
        throw new Error("Stok tidak cukup saat pembayaran");
      }

      // 🔥 POTONG STOK DI SINI
      await ProductVariant.update(
        {
          stok: sequelize.literal(`stok - ${item.quantity}`)
        },
        {
          where: { id: variant.id },
          transaction: t
        }
      );
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