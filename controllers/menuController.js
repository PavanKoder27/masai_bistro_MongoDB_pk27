const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');
const { mockMenuItems, mockCategories } = require('../services/mockData');
const mongoose = require('mongoose');

// Get all menu items with search and filtering
const getMenuItems = async (req, res) => {
  try {
    const {
      search,
      category,
      tags,
      minPrice,
      maxPrice,
      available,
      page = 1,
      limit = 50,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build query object
    let query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagArray };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Availability filter
    if (available !== undefined) {
      query.availability = available === 'true';
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const menuItems = await MenuItem.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MenuItem.countDocuments(query);

    res.json({
      success: true,
      data: menuItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Database error, falling back to mock data:', error.message);
    return getMockMenuItems(req, res);
  }
};

// Get single menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item',
      error: error.message
    });
  }
};

// Create new menu item
const createMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const menuItem = new MenuItem(req.body);
    await menuItem.save();

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating menu item',
      error: error.message
    });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message
    });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item',
      error: error.message
    });
  }
};

// Get menu categories
const getCategories = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: mockCategories,
        note: 'Using mock data - database not connected'
      });
    }

    const categories = await MenuItem.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Database error, falling back to mock categories:', error.message);
    res.json({
      success: true,
      data: mockCategories,
      note: 'Using mock data - database error'
    });
  }
};

// Mock data fallback function for menu items
const getMockMenuItems = (req, res) => {
  const {
    page = 1,
    limit = 50,
    category,
    search,
    tags,
    minPrice,
    maxPrice,
    available = 'true'
  } = req.query;

  let filteredItems = [...mockMenuItems];

  // Apply filters
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(searchLower))
    );
  }

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : tags.split(',');
    filteredItems = filteredItems.filter(item =>
      tagArray.some(tag => item.tags.includes(tag))
    );
  }

  if (minPrice) {
    filteredItems = filteredItems.filter(item => item.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filteredItems = filteredItems.filter(item => item.price <= parseFloat(maxPrice));
  }

  if (available === 'true') {
    filteredItems = filteredItems.filter(item => item.isAvailable);
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const paginatedItems = filteredItems.slice(skip, skip + parseInt(limit));

  res.json({
    success: true,
    data: paginatedItems,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredItems.length / parseInt(limit)),
      totalItems: filteredItems.length,
      itemsPerPage: parseInt(limit)
    },
    note: 'Using mock data - database not connected'
  });
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories
};
