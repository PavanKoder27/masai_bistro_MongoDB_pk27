const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main_course', 'dessert', 'beverage', 'bread', 'salad', 'soup'],
    lowercase: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    enum: ['vegan', 'vegetarian', 'gluten-free', 'mild', 'medium', 'spicy', 'very spicy', 'dairy-free', 'nut-free', 'popular', 'new'],
    lowercase: true
  }],
  availability: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  image: {
    type: String,
    default: null
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  customizations: [{
    name: String,
    options: [{
      name: String,
      additionalPrice: {
        type: Number,
        default: 0
      }
    }]
  }]
}, {
  timestamps: true
});

// Indexes for optimization
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ tags: 1 });
menuItemSchema.index({ price: 1 });
menuItemSchema.index({ availability: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
