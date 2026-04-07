const express = require("express");
const router = express.Router();
const controller = require("../../controllers/ProductVariantController");

router.get("/:productId", controller.getVariants);
router.post("/", controller.createVariant);
router.delete("/:id", controller.deleteVariant);

module.exports = router;