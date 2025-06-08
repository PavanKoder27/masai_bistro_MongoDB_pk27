const { body } = require('express-validator');

// Menu item validation
const validateMenuItem = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('category')
    .isIn(['appetizer', 'main_course', 'dessert', 'beverage', 'salad', 'soup'])
    .withMessage('Invalid category'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isIn(['vegan', 'vegetarian', 'gluten-free', 'spicy', 'mild', 'medium', 'very spicy', 'dairy-free', 'nut-free', 'popular', 'new'])
    .withMessage('Invalid tag'),
  
  body('availability')
    .optional()
    .isBoolean()
    .withMessage('Availability must be a boolean'),
  
  body('preparationTime')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Preparation time must be a positive integer')
];

// Order validation
const validateOrder = [
  body('customer.name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Customer name is required and must not exceed 100 characters'),
  
  body('customer.phone')
    .trim()
    .custom((value) => {
      // Indian phone number validation - matches patterns used in frontend
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      const patterns = [
        /^\+91[6-9]\d{9}$/, // +91XXXXXXXXXX
        /^91[6-9]\d{9}$/,   // 91XXXXXXXXXX
        /^[6-9]\d{9}$/      // XXXXXXXXXX
      ];
      if (!patterns.some(pattern => pattern.test(cleanPhone))) {
        throw new Error('Valid Indian phone number is required (format: +91-XXXXX-XXXXX or 10 digits starting with 6-9)');
      }
      return true;
    }),
  
  body('customer.email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  
  body('items.*.menuItem')
    .isMongoId()
    .withMessage('Valid menu item ID is required'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  
  body('orderType')
    .isIn(['dine_in', 'takeout', 'delivery'])
    .withMessage('Invalid order type'),
  
  body('tableNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Table number must be a positive integer'),
  
  body('paymentMethod')
    .isIn(['cash', 'card', 'online'])
    .withMessage('Invalid payment method'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
];

// User registration validation
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must not exceed 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must not exceed 50 characters'),
  
  body('role')
    .optional()
    .isIn(['admin', 'staff', 'manager'])
    .withMessage('Invalid role'),
  
  body('phone')
    .optional()
    .custom((value) => {
      if (!value) return true; // Optional field
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      const patterns = [
        /^\+91[6-9]\d{9}$/, // +91XXXXXXXXXX
        /^91[6-9]\d{9}$/,   // 91XXXXXXXXXX
        /^[6-9]\d{9}$/      // XXXXXXXXXX
      ];
      if (!patterns.some(pattern => pattern.test(cleanPhone))) {
        throw new Error('Valid Indian phone number is required (format: +91-XXXXX-XXXXX or 10 digits starting with 6-9)');
      }
      return true;
    })
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
];

// Order status update validation
const validateOrderStatus = [
  body('status')
    .isIn(['placed', 'confirmed', 'in_preparation', 'ready', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
  
  body('updatedBy')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Updated by field must not exceed 50 characters')
];

module.exports = {
  validateMenuItem,
  validateOrder,
  validateUserRegistration,
  validateUserLogin,
  validateOrderStatus
};
