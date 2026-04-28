const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/PaymentController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.post("/webhook", paymentController.midtransWebhook); 

router.use(authMiddleware);

router.post("/create/:orderId", paymentController.createPayment);

module.exports = router;