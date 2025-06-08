const mongoose = require('mongoose');

const operatingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openTime: {
    type: String,
    required: true,
    default: '10:00'
  },
  closeTime: {
    type: String,
    required: true,
    default: '22:00'
  }
});

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v); // Indian postal code format
      },
      message: 'Please enter a valid 6-digit postal code'
    }
  },
  country: {
    type: String,
    default: 'India',
    trim: true
  }
});

const financialSettingsSchema = new mongoose.Schema({
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  currencySymbol: {
    type: String,
    default: '₹'
  },
  gstRate: {
    type: Number,
    default: 18,
    min: 0,
    max: 100
  },
  serviceChargeRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  minimumOrderAmount: {
    type: Number,
    default: 200,
    min: 0
  },
  deliveryCharges: {
    type: Number,
    default: 50,
    min: 0
  },
  paymentMethods: [{
    type: String,
    enum: ['cash', 'card', 'upi', 'netbanking', 'wallet']
  }]
});

const restaurantSettingsSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true,
    trim: true,
    default: 'MASAI BISTRO'
  },
  address: {
    type: addressSchema,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^(\+91|91)?[6-9]\d{9}$/.test(v); // Indian phone number format
      },
      message: 'Please enter a valid Indian phone number'
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: 'Authentic Indian cuisine with traditional flavors and modern presentation. Experience the rich heritage of Indian spices and cooking techniques at MASAI BISTRO.'
  },
  cuisineType: {
    type: String,
    default: 'Indian',
    trim: true
  },
  operatingHours: [operatingHoursSchema],
  financialSettings: {
    type: financialSettingsSchema,
    default: () => ({})
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
restaurantSettingsSchema.index({}, { unique: true });

// Pre-save middleware to initialize default operating hours
restaurantSettingsSchema.pre('save', function(next) {
  if (this.isNew && (!this.operatingHours || this.operatingHours.length === 0)) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    this.operatingHours = days.map(day => ({
      day,
      isOpen: true,
      openTime: '10:00',
      closeTime: '22:00'
    }));
  }
  next();
});

// Static method to get or create settings
restaurantSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      restaurantName: 'MASAI BISTRO',
      address: {
        street: '123 Spice Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001'
      },
      phone: '+919876543210',
      email: 'info@masaibistro.com'
    });
  }
  return settings;
};

module.exports = mongoose.model('RestaurantSettings', restaurantSettingsSchema);
