const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

function isAuthenticated(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.redirect('/login');
}

router.get('/dashboard', isAuthenticated, DashboardController.showDashboard);

module.exports = router;