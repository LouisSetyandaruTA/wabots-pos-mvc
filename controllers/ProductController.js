const productService = require("../services/productService");

//Get Product
exports.getProducts = async (req, res) => {
  try {
    console.log("BUSINESS ID:", req.user.businessId); 
    const data = await productService.getAll(req.user.businessId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// CREATE
exports.createProduct = async (req, res) => {
  const data = await productService.createProduct({
    ...req.body,
    businessId: req.user.businessId
  });

  res.json(data);
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
   await productService.update(req.params.id, req.body, req.user.businessId);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    await productService.delete(req.params.id, req.user.businessId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};