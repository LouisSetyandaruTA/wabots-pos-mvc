const express = require("express");
const router = express.Router();
const controller = require("../../controllers/ProductVariantController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/:productId", controller.getVariants);
router.post("/", controller.createVariant);
router.delete("/:id", controller.deleteVariant);
router.put("/:id", controller.updateVariant);

module.exports = router;