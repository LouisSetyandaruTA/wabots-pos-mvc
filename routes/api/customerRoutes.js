const express = require("express");
const router = express.Router();
const { Customer } = require("../../models"); 
const authMiddleware = require("../../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const data = await Customer.findAll({
      where: { businessId: req.user.businessId }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;