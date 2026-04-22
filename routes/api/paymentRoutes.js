const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/PaymentController");

router.post("/create/:orderId", paymentController.createPayment);
router.post("/webhook", paymentController.handleMidtransWebhook);

module.exports = router;