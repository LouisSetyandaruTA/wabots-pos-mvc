const express = require("express");
const router = express.Router();
const reportController = require("../../controllers/ReportController");
const authMiddleware =require("../../middlewares/authMiddleware");

router.get("/",authMiddleware,reportController.getReport);

module.exports = router;