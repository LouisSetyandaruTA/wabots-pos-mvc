const express = require("express");
const router = express.Router();
const productController = require("../../controllers/ProductController");

// router.get("/products", productController.getAllProducts);
router.get("/products", productController.getProducts);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;