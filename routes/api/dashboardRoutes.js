const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/DashboardController");
const authMiddleware = require("../../middlewares/authMiddleware");

// auth
router.get("/", authMiddleware, dashboardController.getDashboard);

module.exports = router;