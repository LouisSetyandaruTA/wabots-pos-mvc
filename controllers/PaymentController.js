const { or } = require("sequelize");
const { Customer, Order, OrderItem } = require("../models");
const orderService = require("../services/orderService");
const paymentService = require("../services/paymentService");

exports.createPayment = async (req, res) => {
  try {
    console.log("CREATE PAYMENT ORDER:", req.params.orderId);

    const transaction = await paymentService.createPayment(req.params.orderId);

    console.log("MIDTRANS RESPONSE:", transaction);

    res.json(transaction);

  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err);
    res.status(500).json({ message: err.message });
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
      as: "customer"
    },
    {
      model: OrderItem,
      as: "items"
    }
  ]
});

    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

    if (order.status === "paid") {
      console.log("⛔ SUDAH PAID, SKIP");
      return res.json({ success: true });
    }

    // HANDLE SUCCESS
    if (["settlement", "capture"].includes(data.transaction_status)) {

      await orderService.completePayment(order.id);

      await paymentService.savePayment(order, data);

      console.log("✅ SET PAID");
    }

    //  HANDLE PENDING)
    else if (data.transaction_status === "pending" && order.status !== "paid") {
      // order.status = "pending";
      await order.save();
    }

    // 🔥 HANDLE CANCEL
    else if (["cancel", "expire"].includes(data.transaction_status)) {
      // order.status = "cancelled";
      await order.save();
    }

    res.json({ success: true });

  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    res.status(200).json({ success: true });
  }
};