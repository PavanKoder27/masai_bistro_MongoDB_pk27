const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateOrder, validateOrderStatus } = require('../middleware/validation');

// Get all orders (staff and above) - requires authentication
router.get('/', authenticateToken, getOrders);

// Get single order by ID - requires authentication
router.get('/:id', authenticateToken, getOrderById);

// Create new order - PUBLIC (no authentication required for customer orders)
router.post('/', validateOrder, createOrder);

// Update order status (staff and above) - requires authentication
router.patch('/:id/status', authenticateToken, validateOrderStatus, updateOrderStatus);

// Cancel order (staff and above) - requires authentication
router.patch('/:id/cancel', authenticateToken, cancelOrder);

module.exports = router;
