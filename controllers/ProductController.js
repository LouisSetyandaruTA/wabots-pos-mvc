const productService = require("../services/productService");

//Get Product
exports.getProducts = async (req, res) => {
  try {
    const data = await productService.getAll();
    res.json(data); // ✅ ARRAY LANGSUNG
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// CREATE
exports.createProduct = async (req, res) => {
  try {
    const data = await productService.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    await productService.update(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    await productService.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};