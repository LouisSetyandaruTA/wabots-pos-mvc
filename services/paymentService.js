const midtransClient = require("midtrans-client");
const { Order, Payment, Customer, OrderItem, ProductVariant } = require("../models");
const orderService = require("./orderService");
const whatsappService =require("./whatsappService");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.createPayment = async (orderId) => {

  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: Customer,
        as: "customer"
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
    ]
  });

  if (!order) {
    throw new Error("Order tidak ditemukan");
  }

  const transaction = await snap.createTransaction({

    transaction_details: {
      order_id: order.id,
      gross_amount: Number(order.totalPrice)
    },

    customer_details: {
      first_name: order.customer?.name || "Customer",
      phone: order.customer?.phoneNumber || ""
    },

    item_details: order.items.map(item => ({
      id: item.variantId,
      price: item.unitPrice,
      quantity: item.quantity,
      name: item.variant?.nama_variant || "Item"
    })),

    enabled_payments: [
      "bca_va",
      "bni_va",
      "permata_va"
    ],

    bank_transfer: {
      bank: "bca"
    }

  });

  await order.update({
  paymentToken: transaction.token,
  paymentUrl: transaction.redirect_url
});

// =========================
// AMBIL VA NUMBER
// =========================
let paymentText = "";

if (
  transaction.va_numbers &&
  transaction.va_numbers.length > 0
) {

  const va =
    transaction.va_numbers[0];

  paymentText =
`Pembayaran Pesanan

Order ID:
${order.id}

Total:
Rp ${order.totalPrice}

Metode:
${va.bank.toUpperCase()} Virtual Account

Nomor VA:
${va.va_number}

Silakan lakukan pembayaran sebelum transaksi expired.`;

} else {

  paymentText =
`Pembayaran Pesanan

Order ID:
${order.id}

Total:
Rp ${order.totalPrice}

Link Pembayaran:
${transaction.redirect_url}`;
}

// =========================
// KIRIM KE WHATSAPP
// =========================
try {

  await whatsappService.sendWhatsAppMessage(
    order.customer.phoneNumber,
    paymentText
  );

} catch (err) {

  console.error(
    "GAGAL KIRIM WA:",
    err.message
  );

}

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