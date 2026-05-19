const sequelize = require("../config/database");
const {
  Order,
  OrderItem,
  ProductVariant,
  Product,
  Customer,
  Business,
} = require("../models");
const { Op } = require("sequelize");

exports.getAllOrders = async (businessId, query) => {
  const { search = "", status = "" } = query;

  const where = { businessId };

  // SEARCH
  if (search) {
    where[Op.or] = [
      { id: { [Op.like]: `%${search}%` } },
      { "$customer.name$": { [Op.like]: `%${search}%` } },
      { "$customer.phoneNumber$": { [Op.like]: `%${search}%` } },
    ];
  }

  // FILTER STATUS
  if (status) {
    where.status = status;
  }

  return await Order.findAll({
    where,

    attributes: [
      "id",
      "businessId",
      "customerId",
      "status",
      "totalPrice",

      /*
      =========================
      PAKSA FIELD INI IKUT
      =========================
      */

      "deliveryMethod",
      "deliveryAddress",
      "fulfillmentStatus",

      "createdAt",
      "updatedAt",
    ],

    include: [
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "name", "phoneNumber"],
      },

      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: ProductVariant,
            as: "variant",

            include: [
              {
                model: Product,
                as: "product",
              },
            ],
          },
        ],
      },
    ],

    order: [["createdAt", "DESC"]],
  });
};
const validateVariant = (variant, qty) => {
  if (!variant) {
    throw new Error("Variant tidak ditemukan");
  }

  qty = parseInt(qty);

  if (isNaN(qty) || qty <= 0) {
    throw new Error("Quantity tidak valid");
  }

  if (variant.stok <= 0) {
    throw new Error(`Stok ${variant.nama_variant} habis`);
  }

  if (qty > variant.stok) {
    throw new Error(`Stok tersisa ${variant.stok}`);
  }
};

exports.createOrder = async (payload) => {
  const t = await sequelize.transaction();

  try {
    const {
      customerId,
      items,
      businessId,
      deliveryMethod,
      deliveryAddress,
      fulfillmentStatus,
    } = payload;

    if (!customerId || !items?.length) {
      throw new Error("Data order tidak valid");
    }

    let totalPrice = 0;

    const order = await Order.create(
      {
        customerId,

        businessId,

        totalPrice: 0,

        status: "pending",

        deliveryMethod,

        deliveryAddress,

        fulfillmentStatus: fulfillmentStatus || null,
      },
      { transaction: t },
    );

    for (const item of items) {
      const variant = await ProductVariant.findByPk(item.variantId, {
        transaction: t,
      });

      validateVariant(variant, item.quantity);

      const subtotal = variant.harga * item.quantity;
      totalPrice += subtotal;

      await OrderItem.create(
        {
          orderId: order.id,
          variantId: variant.id,
          quantity: item.quantity,
          unitPrice: variant.harga,
          subtotal,
        },
        { transaction: t },
      );
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

  if (!["pending", "approved"].includes(order.status)) {
    throw new Error("Order tidak bisa dibatalkan");
  }

  order.status = "approved";
  await order.save();

  return order;
};

exports.completePayment = async (orderId, externalTransaction = null) => {
  const t = externalTransaction || (await sequelize.transaction());

  const isExternal = !!externalTransaction;

  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!order) throw new Error("Order tidak ditemukan");
    if (order.status === "paid") return order;
    if (order.status !== "approved") throw new Error("Order belum di-approve");

    for (const item of order.items) {
      const variant = await ProductVariant.findByPk(item.variantId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      validateVariant(variant, item.quantity);

      const newStock = Math.max(0, variant.stok - item.quantity);

      await variant.update(
        {
          stok: newStock,
        },
        {
          transaction: t,
        },
      );
    }

    order.status = "paid";
    await order.save({ transaction: t });

    if (!isExternal) {
      await t.commit();
    }
    return order;
  } catch (err) {
    if (!isExternal) {
      await t.rollback();
    }
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

const { clearSession } = require("./whatsappSessionService");

const { ChatSession } = require("../models");

const whatsappService = require("./whatsappService");

exports.completeOrder = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: Customer,
        as: "customer",
      },
      {
        model: Business,
        as: "business",
      },
    ],
  });

  if (!order) {
    throw new Error("Order tidak ditemukan");
  }

  if (order.status !== "paid") {
    throw new Error("Order belum dibayar");
  }

  // =========================
  // COMPLETE ORDER
  // =========================
  await order.update({
    fulfillmentStatus: "completed",
  });

  await order.save();

  // =========================
  // WHATSAPP NOTIFICATION
  // =========================
  const phone = order.customer?.phoneNumber;

  if (phone) {
    let message = "";

    // =====================
    // PICKUP
    // =====================
    if (order.deliveryMethod === "pickup") {
      message = `Pesanan Anda telah selesai ✅

Pesanan telah diambil di toko.

Terima kasih telah berbelanja di ${order.business.name} 🙌`;
    } else {
      message = `Pesanan Anda telah selesai ✅

Pesanan berhasil dikirim dan diterima.

Terima kasih telah berbelanja di ${order.business.name} 🙌`;
    }

    await whatsappService.sendWhatsAppMessage(phone, message);

    const { getSession, setSession } = require("./whatsappSessionService");

    const session = getSession(phone);

    if (session) {
      setSession(phone, {
        ...session,
        orderFinished: true,
        orderFinishedAt: Date.now(),
        step: "chatting",
      });
    }

    // JANGAN HAPUS SESSION DI SINI
    console.log("Order selesai. Session tetap aktif 5 menit");
  }

  return order;
};

exports.sendOrder = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: Customer,
        as: "customer",
      },
      {
        model: Business,
        as: "business",
      },
    ],
  });

  if (!order) {
    throw new Error("Order tidak ditemukan");
  }

  /*
  ====================================
  VALIDASI
  ====================================
  */

  if (order.deliveryMethod !== "delivery") {
    throw new Error("Order bukan delivery");
  }

  if (order.fulfillmentStatus !== "delivery") {
    throw new Error("Status order tidak valid");
  }

  /*
  ====================================
  UBAH STATUS
  ====================================
  */

  await order.update({
    fulfillmentStatus: "shipping",
  });

  /*
  ====================================
  KIRIM WA
  ====================================
  */

  await whatsappService.sendWhatsAppMessage(
    order.customer.phoneNumber,

    `Pesanan Anda sedang dikirim 🚚

Toko:
${order.business.name}

Alamat tujuan:
${order.deliveryAddress}

Kurir sedang menuju lokasi Anda 😊`,
  );

  return order;
};

exports.rejectOrder = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: Customer,
        as: "customer",
      },
      {
        model: Business,
        as: "business",
      },
    ],
  });

  if (!order) {
    throw new Error("Order tidak ditemukan");
  }

  if (order.status !== "pending") {
    throw new Error("Hanya order pending yang dapat ditolak");
  }

  /*
  =====================
  UBAH STATUS
  =====================
  */

  await order.update({
    status: "cancelled",
    fulfillmentStatus: "cancelled",
  });

  /*
  =====================
  KIRIM WHATSAPP
  =====================
  */

  await whatsappService.sendWhatsAppMessage(
    order.customer.phoneNumber,

    `Kami dari ${order.business.name} Minta Maaf pesanan Anda tidak dapat diproses ❌

Alasan: Pesanan tidak valid atau produk sedang tidak tersedia.

Silakan lakukan pemesanan ulang Terima Kasih 🙏`,
  );

  const { clearSession } = require("./whatsappSessionService");

  clearSession(order.customer.phoneNumber);

  return order;
};
