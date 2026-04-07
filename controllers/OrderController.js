const orderService = require("../services/orderService");
const { Order, OrderItem, Product, Customer } = require("../models");

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product"
            }
          ]
        },
        {
          model: Customer,
          as: "customer"
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};