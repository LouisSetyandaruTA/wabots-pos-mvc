const Product = require('../models/Product');
const { Op } = require('sequelize');

exports.getDashboard = async (req, res) => {
  try {
    const products = await Product.findAll();
    const summary = {
      totalProducts: products.length,
      totalCategories: new Set(products.map(p => p.kategori)).size,
      totalStock: products.reduce((sum, p) => sum + p.stok, 0),
    };
    res.render('dashboard', { products, summary });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.showDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalCategories = await Product.aggregate('kategori', 'DISTINCT', { plain: false }); // atau sesuaikan dengan model kategori jika terpisah
    res.render('dashboard', {
      summary: {
        totalProducts,
        totalCategories: totalCategories.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan di server');
  }
};
