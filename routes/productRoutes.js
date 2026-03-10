const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

function isAuthenticated(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.redirect('/login');
}

router.get('/products', isAuthenticated, ProductController.listProducts);
router.get('/products/create', isAuthenticated, ProductController.showCreateForm);
router.post('/products/create', isAuthenticated, ProductController.createProduct);
router.get('/products/edit/:id', isAuthenticated, ProductController.showEditForm);
router.post('/products/edit/:id', isAuthenticated, ProductController.updateProduct);
router.post('/products/delete/:id', isAuthenticated, ProductController.deleteProduct);

module.exports = router;