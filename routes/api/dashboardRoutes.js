const router = require("express").Router();
const controller = require("../../controllers/DashboardController");

router.get("/dashboard", controller.getDashboard);

module.exports = router;