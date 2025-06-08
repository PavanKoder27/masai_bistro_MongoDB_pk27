const express = require('express');
const router = express.Router();
const RestaurantSettings = require('../models/RestaurantSettings');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Optional auth middleware - allows both authenticated and unauthenticated access
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    // If token exists, use auth middleware
    auth(req, res, next);
  } else {
    // If no token, continue without user
    req.user = null;
    next();
  }
};

// @route   GET /api/settings
// @desc    Get restaurant settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await RestaurantSettings.getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching restaurant settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/settings
// @desc    Update restaurant settings
// @access  Private (Admin/Manager only)
router.put('/', authenticateToken, async (req, res) => {
  try {
    // Get user data to check role
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has admin or manager role
    if (!['admin', 'manager'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or Manager role required.'
      });
    }

    // Basic validation can be added here if needed

    const settings = await RestaurantSettings.getSettings();
    
    // Update settings with provided data
    Object.keys(req.body).forEach(key => {
      if (key === 'financialSettings') {
        // Merge financial settings
        settings.financialSettings = {
          ...settings.financialSettings.toObject(),
          ...req.body.financialSettings
        };
      } else {
        settings[key] = req.body[key];
      }
    });

    await settings.save();

    res.json({
      success: true,
      message: 'Restaurant settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating restaurant settings:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/settings/reset
// @desc    Reset settings to default values
// @access  Private (Admin only)
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    // Get user data to check role
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    // Delete existing settings and create new default ones
    await RestaurantSettings.deleteMany({});
    const defaultSettings = await RestaurantSettings.getSettings();

    res.json({
      success: true,
      message: 'Restaurant settings reset to default values',
      data: defaultSettings
    });
  } catch (error) {
    console.error('Error resetting restaurant settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
