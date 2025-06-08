const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { mockUsers } = require('../services/mockData');
const mongoose = require('mongoose');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Register new user
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { username, email, password, role, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || 'staff',
      firstName,
      lastName,
      phone
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user with enhanced validation and error handling
const login = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return mockLogin(req, res);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please check your input and try again',
        errors: errors.array().reduce((acc, error) => {
          acc[error.path] = error.msg;
          return acc;
        }, {})
      });
    }

    const { email, password } = req.body;

    // Enhanced input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        errors: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
        errors: {
          email: 'Invalid email format'
        }
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
        errors: {
          credentials: 'No account found with this email address'
        }
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact Masai Bistro support.',
        errors: {
          account: 'Account is inactive'
        }
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
        errors: {
          credentials: 'Incorrect password'
        }
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token with additional claims
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove sensitive information from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: `Welcome back to Masai Bistro, ${user.firstName}!`,
      data: {
        user: userResponse,
        token,
        expiresIn: '24h',
        loginTime: new Date().toISOString(),
        restaurantInfo: {
          name: 'Masai Bistro',
          location: 'Brigade Road, Bangalore',
          phone: '+91-80-4567-8900'
        }
      }
    });
  } catch (error) {
    console.error('Login error, falling back to mock authentication:', error);
    return mockLogin(req, res);
  }
};

// Mock authentication function
const mockLogin = (req, res) => {
  const { email, password } = req.body;

  // Enhanced input validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
      errors: {
        email: !email ? 'Email is required' : null,
        password: !password ? 'Password is required' : null
      }
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address',
      errors: {
        email: 'Invalid email format'
      }
    });
  }

  // Find user in mock data
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please check your credentials.',
      errors: {
        credentials: 'No account found with this email address'
      }
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact Masai Bistro support.',
      errors: {
        account: 'Account is inactive'
      }
    });
  }

  // Simple password check for mock data (in real app, use bcrypt)
  const validPasswords = {
    'admin@masaibistro.com': 'Admin123!',
    'manager@masaibistro.com': 'Manager123!',
    'staff@masaibistro.com': 'Staff123!'
  };

  if (validPasswords[email] !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please check your credentials.',
      errors: {
        credentials: 'Incorrect password'
      }
    });
  }

  // Generate JWT token with additional claims
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    },
    process.env.JWT_SECRET || 'masai_bistro_secret_key',
    { expiresIn: '24h' }
  );

  // Remove sensitive information from response
  const userResponse = { ...user };
  delete userResponse.password;

  res.json({
    success: true,
    message: `Welcome back to Masai Bistro, ${user.firstName}!`,
    data: {
      user: userResponse,
      token,
      expiresIn: '24h',
      loginTime: new Date().toISOString(),
      restaurantInfo: {
        name: 'Masai Bistro',
        location: 'Brigade Road, Bangalore',
        phone: '+91-80-4567-8900'
      }
    },
    note: 'Using mock authentication - database not connected'
  });
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const allowedUpdates = ['firstName', 'lastName', 'phone'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
