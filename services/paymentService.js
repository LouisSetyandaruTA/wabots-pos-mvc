const midtransClient = require("midtrans-client");
const { Order } = require("../models");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.createPayment = async (orderId) => {
  console.log("ORDER ID MASUK:", orderId); // 🔥

  const order = await Order.findByPk(orderId);

  console.log("ORDER DATA:", order); // 🔥

  if (!order) throw new Error("Order tidak ditemukan");

  const parameter = {
    transaction_details: {
      order_id: order.id,
      gross_amount: Number(order.totalPrice) // 🔥 WAJIB NUMBER
    }
  };

  console.log("MIDTRANS PARAM:", parameter); // 🔥

  const transaction = await snap.createTransaction(parameter);
  console.log("SERVER KEY:", process.env.MIDTRANS_SERVER_KEY);
  console.log("MIDTRANS RESPONSE:", transaction); // 🔥

  order.paymentToken = transaction.token;
  order.paymentUrl = transaction.redirect_url;
  await order.save();

  return transaction;
};

exports.handleWebhook = async (notification) => {
  const { order_id, transaction_status } = notification;

  const order = await Order.findByPk(order_id);

  if (!order) throw new Error("Order tidak ditemukan");

  if (transaction_status === "settlement") {
    order.status = "paid";
    await order.save();
  }

  // OPTIONAL (bagus untuk TA)
  if (transaction_status === "pending") {
    order.status = "pending";
    await order.save();
  }

  if (transaction_status === "cancel") {
    order.status = "cancelled";
    await order.save();
  }
};