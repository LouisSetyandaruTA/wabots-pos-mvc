const router = require("express").Router();
const orderController = require('../../controllers/OrderController');

router.get("/orders", orderController.getOrders);
router.post("/", orderController.createOrder);

module.exports = router;