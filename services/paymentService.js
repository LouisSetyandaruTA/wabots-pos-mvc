const midtransClient = require("midtrans-client");
const {
  Order,
  Payment,
  Customer,
  OrderItem,
  ProductVariant,
  Product,
} = require("../models");
const orderService = require("./orderService");
const whatsappService = require("./whatsappService");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

exports.createPayment = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Customer,
          as: "customer",
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
    });

    if (!order) {
      throw new Error("Order tidak ditemukan");
    }

    // ======================================
    // CEK STATUS
    // ======================================

    if (order.status !== "approved") {
      throw new Error("Order belum diapprove");
    }

    const itemDetails = order.items.map((item) => ({
      id: item.variantId,

      price: item.unitPrice,

      quantity: item.quantity,

      name: `${item.variant?.product?.nama || "Produk"}
 - 
${item.variant?.nama_variant || "Default"}`,
    }));

    // ======================================
    // BUAT TRANSAKSI MIDTRANS
    // ======================================
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: order.id,
        gross_amount: Number(order.totalPrice),
      },

      customer_details: {
        first_name: order.customer?.name || "Customer",

        phone: order.customer?.phoneNumber || "",
      },

      item_details: itemDetails,

      enabled_payments: ["bca_va", "bni_va", "permata_va"],

      bank_transfer: {
        bank: "bca",
      },
    });

    // ======================================
    // SIMPAN TOKEN
    // ======================================

    await order.update({
      paymentToken: transaction.token,

      paymentUrl: transaction.redirect_url,
    });

    // ======================================
    // FORMAT PESAN WA
    // ======================================

    const orderSummary = itemDetails
      .map(
        (item) =>
          `${item.quantity}x ${item.name}

Rp ${Number(item.price).toLocaleString("id-ID")}`,
      )

      .join("\n");

    let paymentText = `Pesanan Anda telah disetujui ✅

Detail Pesanan:

${orderSummary}

--------------------

Total:
Rp ${Number(order.totalPrice).toLocaleString("id-ID")}

Silakan pilih metode pembayaran Anda melalui link berikut 😊

${transaction.redirect_url}`;

    // ======================================
    // KIRIM WA
    // ======================================

    console.log("KIRIM WA:", order.customer.phoneNumber);

    await whatsappService.sendWhatsAppMessage(
      order.customer.phoneNumber,

      paymentText,
    );

    console.log("WA PAYMENT TERKIRIM");

    return transaction;
  } catch (err) {
    console.log("PAYMENT ERROR:");

    console.log(err);

    throw err;
  }
};

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

    midtransResponse: midtransData,
  });
};
