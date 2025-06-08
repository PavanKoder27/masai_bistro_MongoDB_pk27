const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');
const { mockRevenueData } = require('../services/mockData');

// Sales report by date range
const getSalesReport = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return getMockSalesReport(req, res);
    }

    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    let matchStage = {
      status: { $in: ['delivered', 'ready'] },
      paymentStatus: 'paid'
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    let groupStage;
    if (groupBy === 'day') {
      groupStage = {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        totalSales: { $sum: '$total' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$total' }
      };
    } else if (groupBy === 'week') {
      groupStage = {
        _id: {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        },
        totalSales: { $sum: '$total' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$total' }
      };
    } else if (groupBy === 'month') {
      groupStage = {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalSales: { $sum: '$total' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$total' }
      };
    }

    const salesData = await Order.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: salesData
    });
  } catch (error) {
    console.error('Database error, falling back to mock sales data:', error);
    return getMockSalesReport(req, res);
  }
};

// Mock sales report function
const getMockSalesReport = (req, res) => {
  try {
    const { groupBy = 'day' } = req.query;

    let salesData;
    if (groupBy === 'month') {
      salesData = mockRevenueData.monthlyRevenue.map(item => ({
        _id: { month: item.month },
        totalRevenue: item.revenue,
        totalOrders: item.orders,
        averageOrderValue: item.revenue / item.orders
      }));
    } else {
      salesData = mockRevenueData.dailyRevenue.map(item => ({
        _id: { date: item.date },
        totalRevenue: item.revenue,
        totalOrders: item.orders,
        averageOrderValue: item.revenue / item.orders
      }));
    }

    res.json({
      success: true,
      data: salesData,
      note: 'Using mock data - database not connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating sales report',
      error: error.message
    });
  }
};

// Most ordered dishes
const getMostOrderedDishes = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return getMockMostOrderedDishes(req, res);
    }

    const { limit = 10 } = req.query;

    const mostOrdered = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'ready'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'menuItem'
        }
      },
      { $unwind: '$menuItem' },
      {
        $project: {
          _id: 1,
          name: '$menuItem.name',
          category: '$menuItem.category',
          price: '$menuItem.price',
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: mostOrdered
    });
  } catch (error) {
    console.error('Database error, falling back to mock popular dishes data:', error);
    return getMockMostOrderedDishes(req, res);
  }
};

// Mock most ordered dishes function
const getMockMostOrderedDishes = (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const popularDishes = mockRevenueData.topSellingItems.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: popularDishes,
      note: 'Using mock data - database not connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching most ordered dishes',
      error: error.message
    });
  }
};

// Category-wise revenue breakdown
const getCategoryRevenue = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return getMockCategoryRevenue(req, res);
    }

    const { startDate, endDate } = req.query;
    
    let matchStage = {
      status: { $in: ['delivered', 'ready'] },
      paymentStatus: 'paid'
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const categoryRevenue = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItem'
        }
      },
      { $unwind: '$menuItem' },
      {
        $group: {
          _id: '$menuItem.category',
          totalRevenue: { $sum: '$items.subtotal' },
          totalQuantity: { $sum: '$items.quantity' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: categoryRevenue
    });
  } catch (error) {
    console.error('Database error, falling back to mock category revenue data:', error);
    return getMockCategoryRevenue(req, res);
  }
};

// Mock category revenue function
const getMockCategoryRevenue = (req, res) => {
  try {
    const categoryRevenue = mockRevenueData.categoryRevenue.map(item => ({
      _id: item.category,
      totalRevenue: item.revenue,
      percentage: item.percentage
    }));

    res.json({
      success: true,
      data: categoryRevenue,
      note: 'Using mock data - database not connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category revenue',
      error: error.message
    });
  }
};

// Peak ordering hours
const getPeakOrderingHours = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return getMockPeakOrderingHours(req, res);
    }

    const { startDate, endDate } = req.query;
    
    let matchStage = {
      status: { $ne: 'cancelled' }
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const peakHours = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: peakHours
    });
  } catch (error) {
    console.error('Database error, falling back to mock peak hours data:', error);
    return getMockPeakOrderingHours(req, res);
  }
};

// Mock peak ordering hours function
const getMockPeakOrderingHours = (req, res) => {
  try {
    const peakHours = [
      { _id: 11, orderCount: 15, totalRevenue: 5250.75 },
      { _id: 12, orderCount: 45, totalRevenue: 15420.50 },
      { _id: 13, orderCount: 52, totalRevenue: 18750.25 },
      { _id: 18, orderCount: 38, totalRevenue: 14200.80 },
      { _id: 19, orderCount: 48, totalRevenue: 22100.75 },
      { _id: 20, orderCount: 61, totalRevenue: 25600.80 },
      { _id: 21, orderCount: 35, totalRevenue: 16850.45 }
    ];

    res.json({
      success: true,
      data: peakHours,
      note: 'Using mock data - database not connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching peak ordering hours',
      error: error.message
    });
  }
};

// Dashboard summary
const getDashboardSummary = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return getMockDashboardSummary(req, res);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's stats
    const todayStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          pendingOrders: {
            $sum: {
              $cond: [{ $in: ['$status', ['placed', 'confirmed', 'in_preparation']] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Total menu items
    const totalMenuItems = await MenuItem.countDocuments({ availability: true });

    // Active orders
    const activeOrders = await Order.countDocuments({
      status: { $in: ['placed', 'confirmed', 'in_preparation'] }
    });

    res.json({
      success: true,
      data: {
        today: todayStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          pendingOrders: 0
        },
        totalMenuItems,
        activeOrders
      }
    });
  } catch (error) {
    console.error('Database error, falling back to mock dashboard data:', error);
    return getMockDashboardSummary(req, res);
  }
};

// Mock dashboard summary function
const getMockDashboardSummary = (req, res) => {
  try {
    const dashboardData = {
      today: {
        totalOrders: mockRevenueData.currentMonthStats.totalOrders,
        totalRevenue: mockRevenueData.currentMonthStats.totalRevenue,
        averageOrderValue: mockRevenueData.currentMonthStats.averageOrderValue,
        pendingOrders: 8
      },
      totalMenuItems: 29,
      activeOrders: 12
    };

    res.json({
      success: true,
      data: dashboardData,
      note: 'Using mock data - database not connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message
    });
  }
};

module.exports = {
  getSalesReport,
  getMostOrderedDishes,
  getCategoryRevenue,
  getPeakOrderingHours,
  getDashboardSummary
};
