const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const isAuthenticated = require('../middlewares/authMiddleware');

router.get('/', isAuthenticated, ProductController.listProducts);
router.get('/create', isAuthenticated, ProductController.showCreateForm);
router.post('/', isAuthenticated, ProductController.createProduct);
router.get('/:id/edit', isAuthenticated, ProductController.showEditForm);
router.post('/:id', isAuthenticated, ProductController.updateProduct);
router.delete('/:id', isAuthenticated, ProductController.deleteProduct);

module.exports = router;