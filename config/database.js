const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes if they don't exist
    await createIndexes();
    
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('⚠️  Running in development mode without database connection');
    console.log('📝 API endpoints will return mock data for testing');
    // Don't exit in development mode - allow server to continue
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

const createIndexes = async () => {
  try {
    const MenuItem = require('../models/MenuItem');
    const Order = require('../models/Order');
    const User = require('../models/User');

    // Ensure text indexes are created
    await MenuItem.createIndexes();
    await Order.createIndexes();
    await User.createIndexes();

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error.message);
  }
};

module.exports = connectDB;

