const router = require("express").Router();
const orderController = require('../../controllers/OrderController');
const express = require("express");

router.get("/", orderController.getOrders);
router.post("/", orderController.createOrder);
router.put("/:id/approve", orderController.approveOrder);
router.put("/:id/payment", orderController.completePayment);

module.exports = router;