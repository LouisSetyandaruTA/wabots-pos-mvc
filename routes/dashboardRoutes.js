const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('dashboard', {
      products, 
      summary: {
        totalProducts: products.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal memuat dashboard');
  }
});

module.exports = router;