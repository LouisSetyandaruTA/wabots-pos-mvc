const express = require("express");
const router = express.Router();
const { Category } = require("../../models");
const authMiddleware = require("../../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const data = await Category.findAll({
    where: { businessId: req.user.businessId }
  });
  res.json(data);
});

router.post("/", async (req, res) => {
  const data = await Category.create({
    name: req.body.name,
    businessId: req.user.businessId
  });
  res.json(data);
});

module.exports = router;