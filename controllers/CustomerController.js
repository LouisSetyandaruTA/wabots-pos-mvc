const customerService = require("../services/customerService");

exports.getCustomers = async (req, res) => {
  try {
    const data = await customerService.getAll(req.user.businessId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};