const { or } = require("sequelize");
const { Customer, Order, OrderItem } = require("../models");
const orderService = require("../services/orderService");
const paymentService = require("../services/paymentService");
const whatsappService = require("../services/whatsappService");
const {
  setSession,
  getSession,
  clearSession,
} = require("../services/whatsappSessionService");

exports.createPayment = async (req, res) => {
  try {
    console.log("CREATE PAYMENT ORDER:", req.params.orderId);

    // CREATE MIDTRANS
    const transaction = await paymentService.createPayment(req.params.orderId);

    // AMBIL ORDER
    const order = await Order.findByPk(req.params.orderId, {
      include: [
        {
          model: Customer,
          as: "customer",
        },
      ],
    });

    // FORMAT PAYMENT TEXT
    let paymentText = "";

    if (transaction.va_numbers && transaction.va_numbers.length > 0) {
      const va = transaction.va_numbers[0];

      paymentText = `
Pesanan Anda telah disetujui ✅

Silakan lakukan pembayaran:

Bank:
${va.bank.toUpperCase()}

VA Number:
${va.va_number}

Total:
Rp ${order.totalPrice}

Link Pembayaran:
${transaction.redirect_url}
`;
    } else {
      paymentText = `
Pesanan Anda telah disetujui ✅

Total:
Rp ${order.totalPrice}

Link Pembayaran:
${transaction.redirect_url}
`;
    }

    // KIRIM WHATSAPP
    await whatsappService.sendWhatsAppMessage(
      order.customer.phoneNumber,
      paymentText,
    );

    console.log("MIDTRANS RESPONSE:", transaction);

    res.json(transaction);
  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.midtransWebhook = async (req, res) => {
  try {
    const data = req.body;

    console.log("🔥 WEBHOOK:", data.transaction_status);

    const order = await Order.findByPk(data.order_id, {
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: OrderItem,
          as: "items",
        },
      ],
    });

    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    if (order.status === "paid") {
      console.log("⛔ SUDAH PAID, SKIP");
      return res.json({ success: true });
    }

    // HANDLE SUCCESS
    if (["settlement", "capture"].includes(data.transaction_status)) {
      await orderService.completePayment(order.id);
      if (order.customer.phoneNumber) {
        await order.update({
          deliveryMethod: null,
          fulfillmentStatus: "waiting_choice",
        });
      }

      await paymentService.savePayment(order, data);
      console.log("KIRIM WA PAYMENT SUCCESS KE:", order.customer.phoneNumber);

      await whatsappService.sendWhatsAppMessage(
        order.customer.phoneNumber,
        `Pembayaran berhasil diterima ✅

Pesanan Anda sedang diproses.

Pilih metode penerimaan pesanan:

1. Ambil di toko
2. Dikirim`,
      );

      console.log("✅ SET PAID");

      const customerSession = getSession(order.customer.phoneNumber);

      if (customerSession) {
        setSession(
          order.customer.phoneNumber,

          {
            ...customerSession,

            step: "waiting_delivery_method",

            lastOrderId: order.id,
          },
        );
      }
    }

    //  HANDLE PENDING)
    else if (data.transaction_status === "pending" && order.status !== "paid") {
      // order.status = "pending";
      await order.save();
    }

    // 🔥 HANDLE CANCEL
    else if (["cancel", "expire"].includes(data.transaction_status)) {
      await order.update({
        status: "cancelled",
      });

      await whatsappService.sendWhatsAppMessage(
        order.customer.phoneNumber,

        `Pembayaran dibatalkan ❌

Silakan lakukan pemesanan ulang.`,
      );

      clearSession(order.customer.phoneNumber);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    res.status(200).json({ success: true });
  }
};
