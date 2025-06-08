const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');
const { mockOrders } = require('../services/mockData');
const mongoose = require('mongoose');

// Get all orders with filtering
const getOrders = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return getMockOrders(req, res);
    }

    const {
      status,
      orderType,
      customerPhone,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    let query = {};

    if (status) {
      query.status = status;
    }

    if (orderType) {
      query.orderType = orderType;
    }

    if (customerPhone) {
      query['customer.phone'] = { $regex: customerPhone, $options: 'i' };
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('items.menuItem', 'name category price')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Database error, falling back to mock data:', error);
    return getMockOrders(req, res);
  }
};

// Mock orders function for development
const getMockOrders = (req, res) => {
  const {
    status,
    orderType,
    customerPhone,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let filteredOrders = [...mockOrders];

  // Apply filters
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }

  if (orderType) {
    filteredOrders = filteredOrders.filter(order => order.orderType === orderType);
  }

  if (customerPhone) {
    filteredOrders = filteredOrders.filter(order =>
      order.customer.phone.includes(customerPhone)
    );
  }

  if (startDate) {
    const start = new Date(startDate);
    filteredOrders = filteredOrders.filter(order =>
      new Date(order.createdAt) >= start
    );
  }

  if (endDate) {
    const end = new Date(endDate);
    filteredOrders = filteredOrders.filter(order =>
      new Date(order.createdAt) <= end
    );
  }

  // Sort orders
  filteredOrders.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortOrder === 'desc') {
      return new Date(bValue) - new Date(aValue);
    } else {
      return new Date(aValue) - new Date(bValue);
    }
  });

  // Apply pagination
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedOrders,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredOrders.length / parseInt(limit)),
      totalItems: filteredOrders.length,
      itemsPerPage: parseInt(limit)
    },
    note: 'Using mock data - database not connected'
  });
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem', 'name category price description');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return createMockOrder(req, res);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { customer, items, orderType, tableNumber, paymentMethod, notes } = req.body;

    // Calculate order totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item not found: ${item.menuItem}`
        });
      }

      if (!menuItem.availability) {
        return res.status(400).json({
          success: false,
          message: `Menu item not available: ${menuItem.name}`
        });
      }

      let itemSubtotal = menuItem.price * item.quantity;
      
      // Add customization costs
      if (item.customizations) {
        for (const customization of item.customizations) {
          itemSubtotal += customization.additionalPrice * item.quantity;
        }
      }

      processedItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        customizations: item.customizations || [],
        specialInstructions: item.specialInstructions || '',
        subtotal: itemSubtotal
      });

      subtotal += itemSubtotal;
    }

    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax;

    // Calculate estimated delivery time
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 30);

    const order = new Order({
      customer,
      items: processedItems,
      orderType,
      tableNumber,
      subtotal,
      tax,
      total,
      paymentMethod,
      estimatedDeliveryTime,
      notes,
      statusHistory: [{
        status: 'placed',
        timestamp: new Date(),
        updatedBy: 'system'
      }]
    });

    await order.save();

    // Populate the order before sending response
    await order.populate('items.menuItem', 'name category price');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Database error, falling back to mock order creation:', error);
    return createMockOrder(req, res);
  }
};

// Mock order creation function
const createMockOrder = (req, res) => {
  try {
    const { customer, items, orderType, tableNumber, deliveryAddress, specialInstructions } = req.body;

    // Validate required fields
    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone are required',
        errors: {
          customer: 'Customer information is incomplete'
        }
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
        errors: {
          items: 'No items in order'
        }
      });
    }

    // Generate new order number
    const existingOrders = mockOrders.length;
    const orderNumber = `MB${String(existingOrders + 7).padStart(3, '0')}`;

    // Calculate totals
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    // Create new order
    const newOrder = {
      _id: `order${existingOrders + 7}`,
      orderNumber,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || `${customer.name.toLowerCase().replace(' ', '.')}@gmail.com`
      },
      items: items.map(item => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      subtotal,
      tax,
      total,
      orderType: orderType || 'dine_in',
      tableNumber: orderType === 'dine_in' ? tableNumber : null,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
      status: 'placed',
      paymentStatus: 'pending',
      paymentMethod: 'cash',
      specialInstructions: specialInstructions || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: Math.max(15, Math.max(...items.map(item => item.menuItem.preparationTime || 15))),
      actualTime: null
    };

    // Add to mock orders (in memory)
    mockOrders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: `Order ${orderNumber} placed successfully! Estimated time: ${newOrder.estimatedTime} minutes.`,
      data: newOrder,
      note: 'Using mock data - database not connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, updatedBy = 'staff' } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status and add to history
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy
    });

    // Set actual delivery time if status is delivered
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel delivered order'
      });
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      updatedBy: req.body.updatedBy || 'staff'
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder
};
