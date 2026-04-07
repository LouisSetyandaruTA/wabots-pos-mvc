const service = require("../services/productVariantService");

exports.getVariants = async (req, res) => {
  const data = await service.getByProduct(req.params.productId);
  res.json(data);
};

exports.createVariant = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteVariant = async (req, res) => {
  await service.delete(req.params.id);
  res.json({ success: true });
};