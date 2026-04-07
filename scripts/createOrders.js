const sequelize = require('../config/database');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

async function createDummyOrder() {
  try {
    await sequelize.sync(); 

    const customer = await Customer.findOne(); 
    const product = await Product.findOne();

    if (!customer || !product) throw new Error('Customer atau Product tidak ditemukan');

    const quantity = 3;
    const unitPrice = product.harga;
    const subtotal = unitPrice * quantity;

    const order = await Order.create({
      customerId: customer.id,
      totalPrice: subtotal
    });

    await OrderItem.create({
      orderId: order.id,
      productId: product.id,
      quantity,
      unitPrice,
      subtotal
    });

    console.log('Dummy order berhasil dibuat');
    process.exit();
  } catch (err) {
    console.error('Gagal:', err);
    process.exit(1);
  }
}

createDummyOrder();