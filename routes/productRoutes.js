// const express = require('express');
// const router = express.Router();
// const ProductController = require('../controllers/ProductController');

// function isAuthenticated(req, res, next) {
//   if (req.session && req.session.adminId) {
//     return next();
//   }
//   return res.redirect('/login');
// }

// router.get('/products', isAuthenticated, ProductController.listProducts);
// router.get('/products/create', isAuthenticated, ProductController.showCreateForm);
// router.post('/products/create', isAuthenticated, ProductController.createProduct);
// router.get('/products/edit/:id', isAuthenticated, ProductController.showEditForm);
// router.post('/products/edit/:id', isAuthenticated, ProductController.updateProduct);
// router.post('/products/delete/:id', isAuthenticated, ProductController.deleteProduct);

// module.exports = router;

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const isAuthenticated = require('../middlewares/authMiddleware');

router.get('/', isAuthenticated, ProductController.listProducts);
router.get('/create', isAuthenticated, ProductController.showCreateForm);
router.post('/', isAuthenticated, ProductController.createProduct);
router.get('/:id/edit', isAuthenticated, ProductController.showEditForm);
router.post('/:id', isAuthenticated, ProductController.updateProduct);
router.post('/:id/delete', isAuthenticated, ProductController.deleteProduct);

module.exports = router;
