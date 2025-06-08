const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  customizations: [{
    name: String,
    selectedOption: String,
    additionalPrice: {
      type: Number,
      default: 0
    }
  }],
  specialInstructions: {
    type: String,
    maxlength: 200
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: false // Will be set by pre-save middleware
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      street: String,
      city: String,
      zipCode: String
    }
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'in_preparation', 'ready', 'delivered', 'cancelled'],
    default: 'placed'
  },
  orderType: {
    type: String,
    enum: ['dine_in', 'takeout', 'delivery'],
    required: true
  },
  tableNumber: {
    type: Number,
    required: function() {
      return this.orderType === 'dine_in';
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  tip: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 500
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: String
  }]
}, {
  timestamps: true
});

// Indexes for optimization
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderType: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.email': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
