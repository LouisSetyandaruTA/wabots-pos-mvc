const { Order, Product } = require("../models");

exports.getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalProducts = await Product.count();

    res.json({
      totalOrders,
      totalProducts,
      totalRevenue: 0, // nanti kita hitung
      pendingOrders: 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};