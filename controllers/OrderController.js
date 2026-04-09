const orderService = require("../services/orderService");
const { Order, OrderItem, Product, Customer } = require("../models");


// CREATE
exports.createOrder = async (req, res) => {
  try {
    const data = await orderService.createOrder(req.body);
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
    const data = await orderService.getAllOrders();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};