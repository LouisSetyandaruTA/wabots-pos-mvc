const { Customer } = require("../models");

exports.getCustomers = async (req, res) => {
  try {
    const data = await Customer.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};