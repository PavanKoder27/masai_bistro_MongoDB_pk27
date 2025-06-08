const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories
} = require('../controllers/menuController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateMenuItem } = require('../middleware/validation');

// Public routes (no authentication required)
router.get('/', getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

// Protected routes (authentication required)
router.post('/', 
  authenticateToken, 
  authorizeRole('admin', 'manager'), 
  validateMenuItem, 
  createMenuItem
);

router.put('/:id', 
  authenticateToken, 
  authorizeRole('admin', 'manager'), 
  validateMenuItem, 
  updateMenuItem
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRole('admin', 'manager'), 
  deleteMenuItem
);

module.exports = router;
