const orderService = require("../services/orderService");
const paymentService = require("../services/paymentService");

// CREATE
exports.createOrder = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.id // ambil dari token
    };

    const data = await orderService.createOrder(payload);

    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// APPROVE
exports.approveOrder = async (req, res) => {
  try {
    const data = await orderService.approveOrder(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PAYMENT SUCCESS (SIMULASI)
exports.completePayment = async (req, res) => {
  try {
    const data = await orderService.completePayment(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const data = await orderService.getAllOrders(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const url = await paymentService.createPayment(req.params.id);

    res.json({
      success: true,
      paymentUrl: url
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};