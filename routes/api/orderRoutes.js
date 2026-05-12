const router = require("express").Router();
const orderController = require("../../controllers/OrderController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.get("/", authMiddleware, orderController.getOrders);
router.post("/", authMiddleware, orderController.createOrder);
router.put("/:id/approve", authMiddleware, orderController.approveOrder);
router.put("/:id/payment", authMiddleware, orderController.completePayment);
router.get("/:id", authMiddleware, orderController.getOrderById);
router.delete("/:id", authMiddleware, orderController.deleteOrder);
router.post("/:id/pay",authMiddleware,orderController.payOrder);

module.exports = router;