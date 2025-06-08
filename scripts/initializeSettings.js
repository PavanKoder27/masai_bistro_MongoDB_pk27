const mongoose = require('mongoose');
const RestaurantSettings = require('../models/RestaurantSettings');
require('dotenv').config();

const initializeSettings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-management');
    console.log('Connected to MongoDB');

    // Check if settings already exist
    const existingSettings = await RestaurantSettings.findOne();
    if (existingSettings) {
      console.log('Restaurant settings already exist');
      return;
    }

    // Create default settings
    const defaultSettings = new RestaurantSettings({
      restaurantName: 'MASAI BISTRO',
      address: {
        street: '42, Brigade Road, Near Commercial Street',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560025',
        country: 'India'
      },
      phone: '+91-80-4567-8900',
      email: 'info@masaibistro.com',
      website: 'https://masaibistro.com',
      description: 'Experience the authentic flavors of India at Masai Bistro - where traditional recipes meet modern culinary artistry. Our master chefs bring you the finest Indian cuisine with fresh ingredients, aromatic spices, and warm hospitality. From North Indian classics to South Indian specialties, every dish tells a story of India\'s rich culinary heritage.',
      cuisineType: 'Indian',
      operatingHours: [
        { day: 'monday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
        { day: 'tuesday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
        { day: 'wednesday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
        { day: 'thursday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
        { day: 'friday', isOpen: true, openTime: '11:00', closeTime: '23:30' },
        { day: 'saturday', isOpen: true, openTime: '11:00', closeTime: '23:30' },
        { day: 'sunday', isOpen: true, openTime: '12:00', closeTime: '22:30' }
      ],
      financialSettings: {
        currency: 'INR',
        currencySymbol: '₹',
        gstRate: 18,
        serviceChargeRate: 0,
        minimumOrderAmount: 200,
        deliveryCharges: 50,
        paymentMethods: ['cash', 'card', 'upi', 'netbanking']
      },
      timezone: 'Asia/Kolkata'
    });

    await defaultSettings.save();
    console.log('✅ Default restaurant settings created successfully!');
    console.log('Restaurant Name:', defaultSettings.restaurantName);
    console.log('Address:', `${defaultSettings.address.street}, ${defaultSettings.address.city}`);
    console.log('Currency:', defaultSettings.financialSettings.currency);
    console.log('GST Rate:', defaultSettings.financialSettings.gstRate + '%');

  } catch (error) {
    console.error('❌ Error initializing settings:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the initialization
initializeSettings();
