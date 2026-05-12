const express = require("express");

const router = express.Router();

const businessController =
require("../../controllers/businessController");

const authMiddleware =
require("../../middlewares/authMiddleware");

router.get(
  "/me",
  authMiddleware,
  businessController.getMyBusiness
);

router.put(
  "/me",
  authMiddleware,
  businessController.updateMyBusiness
);

module.exports = router;