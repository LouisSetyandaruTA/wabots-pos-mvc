const midtransClient = require("midtrans-client");
const { Order, Payment, Customer, OrderItem, ProductVariant } = require("../models");
const orderService = require("./orderService");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.createPayment = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      { model: Customer, as: "customer" },
      {
        model: OrderItem,
        as: "items",
        include: [{ model: ProductVariant, as: "variant" }]
      }
    ]
  });

  if (!order) throw new Error("Order tidak ditemukan");

  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: order.id,
      gross_amount: Number(order.totalPrice)
    },

    customer_details: {
      first_name: order.customer?.name || "Customer",
      phone: order.customer?.phoneNumber || "08123456789"
    },

    item_details: order.items.map(item => ({
      id: item.variantId,
      price: item.unitPrice,
      quantity: item.quantity,
      name: item.variant?.nama_variant || "Item"
    })),

    callbacks: {
      finish: `http://localhost:3000/admin/orders`
    }
  });

  await order.update({
    paymentToken: transaction.token,
    paymentUrl: transaction.redirect_url
  });

  return transaction;
};

// exports.handleWebhook = async (req, res) => {
//   const data = req.body;

//   const order = await Order.findByPk(data.order_id, {
//     include: [
//       { model: Customer, as: "customer" },
//       {
//         model: OrderItem,
//         as: "items",
//         include: [{ model: ProductVariant, as: "variant" }]
//       }
//     ]
//   });

//   if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

//   if (data.transaction_status === "settlement") {

//     // potong stok & update status
//     await orderService.completePayment(order.id);

//     // simpan ke payment table
//     await Payment.create({
//       orderId: order.id,
//       businessId: order.businessId,

//       customerName: order.customer.name,
//       customerPhone: order.customer.phoneNumber,

//       totalPrice: order.totalPrice,
//       paidAmount: order.totalPrice,

//       method: data.payment_type,
//       status: data.transaction_status,

//       midtransResponse: data
//     });
//   }

//   res.json({ success: true });
// };

exports.savePayment = async (order, midtransData) => {
  return await Payment.create({
    orderId: order.id,
    businessId: order.businessId,

    customerName: order.customer?.name || "-",
    customerPhone: order.customer?.phoneNumber || "-",

    totalPrice: order.totalPrice,
    paidAmount: order.totalPrice,

    method: midtransData.payment_type,
    status: midtransData.transaction_status,

    midtransResponse: midtransData
  });
};

// exports.handleMidtransWebhook = async (req, res) => {
//   const data = req.body;

//   if (data.transaction_status === "settlement") {

//     const order = await Order.findByPk(data.order_id, {
//       include: ["customer", "items"]
//     });

//     await orderService.completePayment(order.id);

//     await paymentService.savePayment(order, data);
//   }

//   res.json({ success: true });
// };