const service = require("../services/productVariantService");

exports.getVariants = async (req, res) => {
  const data = await service.getByProduct(
    req.params.productId,
    req.user.businessId
  );
  res.json(data);
};

exports.createVariant = async (req, res) => {
  const data = await service.create(req.body, req.user.businessId);
  res.json(data);
};

exports.deleteVariant = async (req, res) => {
  await service.delete(req.params.id);
  res.json({ success: true });
};

exports.updateVariant = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};