const router = require("express").Router();
const orderController = require("../../controllers/OrderController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.get("/", authMiddleware, orderController.getOrders);
router.post("/", authMiddleware, orderController.createOrder);
router.put("/:id/approve", authMiddleware, orderController.approveOrder);
router.put("/:id/payment", authMiddleware, orderController.completePayment);
router.post("/:id/pay", authMiddleware, orderController.createPayment);
router.get("/:id", authMiddleware, orderController.getOrderById);

module.exports = router;