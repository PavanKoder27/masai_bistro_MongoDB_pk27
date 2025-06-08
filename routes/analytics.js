const express = require('express');
const router = express.Router();
const {
  getSalesReport,
  getMostOrderedDishes,
  getCategoryRevenue,
  getPeakOrderingHours,
  getDashboardSummary
} = require('../controllers/analyticsController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All analytics routes require authentication and manager/admin role
router.use(authenticateToken);
router.use(authorizeRole('admin', 'manager'));

// Dashboard summary
router.get('/dashboard', getDashboardSummary);

// Sales report
router.get('/sales', getSalesReport);

// Most ordered dishes
router.get('/popular-dishes', getMostOrderedDishes);

// Category-wise revenue
router.get('/category-revenue', getCategoryRevenue);

// Peak ordering hours
router.get('/peak-hours', getPeakOrderingHours);

module.exports = router;
