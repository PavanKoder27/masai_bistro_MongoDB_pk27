const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { mockUsers } = require('../services/mockData');
const mongoose = require('mongoose');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'masai_bistro_secret_key');

    // Check if database is connected
    if (mongoose.connection.readyState === 1) {
      // Database connected - use database user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
    } else {
      // Database not connected - use mock user validation
      const mockUser = mockUsers.find(u => u._id === decoded.userId);
      if (!mockUser || !mockUser.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

// Check user role
const authorizeRole = (...roles) => {
  return async (req, res, next) => {
    try {
      let user;

      // Check if database is connected
      if (mongoose.connection.readyState === 1) {
        // Database connected - use database user
        user = await User.findById(req.user.userId);
      } else {
        // Database not connected - use mock user
        user = mockUsers.find(u => u._id === req.user.userId);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions',
        error: error.message
      });
    }
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};
