import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Chip
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  Payment,
  Restaurant,
  LocalShipping,
  TableRestaurant
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ordersAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Utility function for consistent currency formatting
const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

// Utility function to validate cart item data
const validateCartItem = (item) => {
  const errors = [];

  if (!item) {
    errors.push('Item is null or undefined');
    return errors;
  }

  if (!item._id) {
    errors.push('Item missing _id field');
  }

  if (!item.name || typeof item.name !== 'string' || !item.name.trim()) {
    errors.push('Item missing or invalid name');
  }

  if (item.price === undefined || item.price === null || isNaN(item.price) || item.price <= 0) {
    errors.push(`Item has invalid price: ${item.price}`);
  }

  if (item.quantity === undefined || item.quantity === null || isNaN(item.quantity) || item.quantity < 1) {
    errors.push(`Item has invalid quantity: ${item.quantity}`);
  }

  // Optional fields validation
  if (item.category && typeof item.category !== 'string') {
    errors.push('Item category must be a string');
  }

  if (item.description && typeof item.description !== 'string') {
    errors.push('Item description must be a string');
  }

  if (item.spiceLevel && typeof item.spiceLevel !== 'string') {
    errors.push('Item spice level must be a string');
  }

  if (item.preparationTime && (isNaN(item.preparationTime) || item.preparationTime < 0)) {
    errors.push('Item preparation time must be a positive number');
  }

  return errors;
};

// Utility function to clean cart item data
const cleanCartItem = (item) => {
  if (!item) return null;

  return {
    _id: item._id,
    name: item.name ? item.name.toString().trim() : '',
    price: parseFloat(item.price) || 0,
    quantity: parseInt(item.quantity) || 1,
    category: item.category ? item.category.toString().trim() : 'uncategorized',
    description: item.description ? item.description.toString().trim() : '',
    spiceLevel: item.spiceLevel && item.spiceLevel !== 'undefined' ? item.spiceLevel.toString().trim() : null,
    preparationTime: item.preparationTime ? parseInt(item.preparationTime) : null,
    isVegetarian: Boolean(item.isVegetarian),
    availability: item.availability !== false // Default to true unless explicitly false
  };
};

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, calculateTotals } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: ''
  });
  
  const [orderDetails, setOrderDetails] = useState({
    orderType: 'dine_in',
    tableNumber: '',
    paymentMethod: 'cash',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const totals = calculateTotals();



  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOrderDetailsChange = (field, value) => {
    setOrderDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    // Customer name validation
    if (!customerInfo.name || !customerInfo.name.trim()) {
      setError('Customer name is required');
      return false;
    }

    if (customerInfo.name.trim().length > 100) {
      setError('Customer name must not exceed 100 characters');
      return false;
    }

    // Customer phone validation
    if (!customerInfo.phone || !customerInfo.phone.trim()) {
      setError('Customer phone is required');
      return false;
    }

    // Phone format validation (Indian format)
    const cleanPhone = customerInfo.phone.replace(/[\s\-\(\)]/g, '');
    const phonePatterns = [
      /^\+91[6-9]\d{9}$/, // +91XXXXXXXXXX
      /^91[6-9]\d{9}$/,   // 91XXXXXXXXXX
      /^[6-9]\d{9}$/      // XXXXXXXXXX
    ];

    if (!phonePatterns.some(pattern => pattern.test(cleanPhone))) {
      setError('Valid Indian phone number is required (format: +91-XXXXX-XXXXX or 10 digits starting with 6-9)');
      return false;
    }

    // Email validation (optional but if provided must be valid)
    if (customerInfo.email && customerInfo.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email.trim())) {
        setError('Valid email address is required');
        return false;
      }
    }

    // Cart items validation
    if (!cart.items || cart.items.length === 0) {
      setError('Cart is empty - please add items before placing order');
      return false;
    }

    // Validate each cart item
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];

      if (!item._id) {
        setError(`Cart item ${i + 1} is missing ID`);
        return false;
      }

      if (!item.quantity || item.quantity < 1) {
        setError(`Cart item ${i + 1} has invalid quantity: ${item.quantity}`);
        return false;
      }

      if (!item.price || item.price <= 0) {
        setError(`Cart item ${i + 1} has invalid price: ${item.price}`);
        return false;
      }

      if (!item.name || !item.name.trim()) {
        setError(`Cart item ${i + 1} is missing name`);
        return false;
      }
    }

    // Order type validation
    const validOrderTypes = ['dine_in', 'takeout', 'delivery'];
    if (!validOrderTypes.includes(orderDetails.orderType)) {
      setError(`Invalid order type: ${orderDetails.orderType}`);
      return false;
    }

    // Table number validation for dine-in
    if (orderDetails.orderType === 'dine_in') {
      if (!orderDetails.tableNumber || !orderDetails.tableNumber.toString().trim()) {
        setError('Table number is required for dine-in orders');
        return false;
      }

      const tableNum = parseInt(orderDetails.tableNumber);
      if (isNaN(tableNum) || tableNum < 1) {
        setError('Table number must be a positive integer');
        return false;
      }
    }

    // Delivery address validation
    if (orderDetails.orderType === 'delivery') {
      if (!customerInfo.address || !customerInfo.address.trim()) {
        setError('Delivery address is required for delivery orders');
        return false;
      }
    }

    // Payment method validation
    const validPaymentMethods = ['cash', 'card', 'online'];
    if (!validPaymentMethods.includes(orderDetails.paymentMethod)) {
      setError(`Invalid payment method: ${orderDetails.paymentMethod}`);
      return false;
    }

    // Notes validation (optional but if provided must not exceed limit)
    if (orderDetails.notes && orderDetails.notes.length > 500) {
      setError('Notes must not exceed 500 characters');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Clean and validate customer data
      const cleanCustomerData = {
        name: customerInfo.name.trim(),
        phone: customerInfo.phone.trim(),
        email: customerInfo.email && customerInfo.email.trim() ? customerInfo.email.trim() : undefined
      };

      // Add address for delivery orders
      if (orderDetails.orderType === 'delivery') {
        cleanCustomerData.address = {
          street: customerInfo.address.trim(),
          city: 'Mumbai',
          zipCode: '400001'
        };
      }

      // Clean and validate cart items
      const cleanItems = cart.items.map((item, index) => {
        // Ensure all required fields are present and valid
        const cleanItem = {
          menuItem: item._id,
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.price),
          subtotal: parseFloat(item.price * item.quantity)
        };

        // Validate the cleaned item
        if (!cleanItem.menuItem) {
          throw new Error(`Item ${index + 1} is missing menu item ID`);
        }

        if (isNaN(cleanItem.quantity) || cleanItem.quantity < 1) {
          throw new Error(`Item ${index + 1} has invalid quantity: ${item.quantity}`);
        }

        if (isNaN(cleanItem.unitPrice) || cleanItem.unitPrice <= 0) {
          throw new Error(`Item ${index + 1} has invalid price: ${item.price}`);
        }

        if (isNaN(cleanItem.subtotal) || cleanItem.subtotal <= 0) {
          throw new Error(`Item ${index + 1} has invalid subtotal calculation`);
        }

        return cleanItem;
      });

      // Calculate and validate totals
      const calculatedTotals = calculateTotals();

      // Prepare final order data
      const orderData = {
        customer: cleanCustomerData,
        items: cleanItems,
        orderType: orderDetails.orderType,
        subtotal: parseFloat(calculatedTotals.subtotal.toFixed(2)),
        tax: parseFloat(calculatedTotals.gst.toFixed(2)),
        tip: 0,
        total: parseFloat(calculatedTotals.total.toFixed(2)),
        paymentMethod: orderDetails.paymentMethod,
        notes: orderDetails.notes && orderDetails.notes.trim() ? orderDetails.notes.trim() : undefined
      };

      // Add table number for dine-in orders
      if (orderDetails.orderType === 'dine_in') {
        orderData.tableNumber = parseInt(orderDetails.tableNumber);
      }

      // Remove undefined fields to clean up the payload
      Object.keys(orderData).forEach(key => {
        if (orderData[key] === undefined) {
          delete orderData[key];
        }
      });

      const response = await ordersAPI.createOrder(orderData);

      if (response.data.success) {
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        const errorMessage = response.data.message || 'Failed to place order';
        setError(errorMessage);
      }
    } catch (err) {
      // Enhanced error handling
      if (err.response) {
        // Handle validation errors specifically
        if (err.response.data && err.response.data.errors) {
          const validationErrors = err.response.data.errors.map(error =>
            `${error.path}: ${error.msg}`
          ).join(', ');
          setError(`Validation errors: ${validationErrors}`);
        } else {
          setError(err.response.data?.message || `Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Network error: Unable to reach server');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6">Order Placed Successfully!</Typography>
          <Typography>Redirecting to orders page...</Typography>
        </Alert>
      </Container>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" py={8}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add some delicious items from our menu to get started!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/menu')}
            startIcon={<Restaurant />}
          >
            Browse Menu
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
          fontWeight: 600,
          color: 'primary.main'
        }}
      >
        <ShoppingCart />
        Your Cart ({cart.totalItems} items)
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}



      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: 'text.primary',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 1
                }}
              >
                Order Items
              </Typography>
              <List sx={{ p: 0 }}>
                {cart.items.map((item, index) => (
                  <React.Fragment key={item._id}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        p: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        mb: index < cart.items.length - 1 ? 3 : 0,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                          boxShadow: 2,
                          borderColor: 'primary.light'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Product Header with Name and Price */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 2
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              mb: 0.5,
                              wordBreak: 'break-word',
                              lineHeight: 1.3
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: 'primary.main',
                              fontSize: '1.1rem',
                              fontFamily: 'monospace'
                            }}
                          >
                            {formatCurrency(item.price)} each
                          </Typography>
                        </Box>

                        {/* Remove Button */}
                        <IconButton
                          onClick={() => removeFromCart(item._id)}
                          color="error"
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: 'error.light',
                              color: 'white'
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>

                      {/* Product Description */}
                      {item.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.6,
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {item.description}
                        </Typography>
                      )}

                      {/* Product Tags */}
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Chip
                          label={item.category.replace('_', ' ').toUpperCase()}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                        {item.isVegetarian && (
                          <Chip label="VEG" size="small" color="success" />
                        )}
                        {item.spiceLevel && item.spiceLevel !== 'undefined' && (
                          <Chip
                            label={`${item.spiceLevel.charAt(0).toUpperCase() + item.spiceLevel.slice(1)} Spice`}
                            size="small"
                            color="warning"
                          />
                        )}
                        {item.preparationTime && (
                          <Chip
                            label={`${item.preparationTime} min`}
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        )}
                      </Box>

                      {/* Quantity Controls and Total Price */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 2,
                          pt: 1,
                          borderTop: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        {/* Quantity Controls */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            border: '2px solid',
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            p: 0.5,
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText'
                          }}
                        >
                          <IconButton
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            size="small"
                            sx={{
                              color: 'primary.main',
                              backgroundColor: 'white',
                              '&:hover': {
                                backgroundColor: 'grey.100'
                              }
                            }}
                          >
                            <Remove />
                          </IconButton>
                          <Typography
                            variant="body1"
                            sx={{
                              minWidth: '50px',
                              textAlign: 'center',
                              fontWeight: 700,
                              px: 2,
                              color: 'primary.main'
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            size="small"
                            sx={{
                              color: 'primary.main',
                              backgroundColor: 'white',
                              '&:hover': {
                                backgroundColor: 'grey.100'
                              }
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Box>

                        {/* Total Price for this item */}
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Total for {item.quantity} item{item.quantity > 1 ? 's' : ''}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: 'primary.main',
                              fontSize: '1.4rem',
                              fontFamily: 'monospace'
                            }}
                          >
                            {formatCurrency(item.price * item.quantity)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary and Customer Info */}
        <Grid item xs={12} md={4}>
          {/* Order Summary */}
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: 'text.primary',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 1
                }}
              >
                Order Summary
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Subtotal:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                  {formatCurrency(totals.subtotal)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  GST (18%):
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                  {formatCurrency(totals.gst)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    fontFamily: 'monospace'
                  }}
                >
                  {formatCurrency(totals.total)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: 'text.primary',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 1
                }}
              >
                Customer Information
              </Typography>
              <TextField
                fullWidth
                label="Name"
                value={customerInfo.name}
                onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                margin="normal"
                required
                sx={{ mb: 3 }}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Phone"
                value={customerInfo.phone}
                onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                margin="normal"
                required
                sx={{ mb: 3 }}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email (Optional)"
                value={customerInfo.email}
                onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                margin="normal"
                sx={{ mb: 2 }}
                variant="outlined"
              />
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: 'text.primary',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 1
                }}
              >
                Order Details
              </Typography>
              <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                <InputLabel>Order Type</InputLabel>
                <Select
                  value={orderDetails.orderType}
                  onChange={(e) => handleOrderDetailsChange('orderType', e.target.value)}
                  label="Order Type"
                >
                  <MenuItem value="dine_in">
                    <Box display="flex" alignItems="center" gap={1}>
                      <TableRestaurant />
                      Dine In
                    </Box>
                  </MenuItem>
                  <MenuItem value="takeout">
                    <Box display="flex" alignItems="center" gap={1}>
                      <ShoppingCart />
                      Takeout
                    </Box>
                  </MenuItem>
                  <MenuItem value="delivery">
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalShipping />
                      Delivery
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {orderDetails.orderType === 'dine_in' && (
                <TextField
                  fullWidth
                  label="Table Number"
                  value={orderDetails.tableNumber}
                  onChange={(e) => handleOrderDetailsChange('tableNumber', e.target.value)}
                  margin="normal"
                  required
                  type="number"
                />
              )}

              {orderDetails.orderType === 'delivery' && (
                <TextField
                  fullWidth
                  label="Delivery Address"
                  value={customerInfo.address}
                  onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                  margin="normal"
                  required
                  multiline
                  rows={2}
                />
              )}

              <FormControl fullWidth margin="normal">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={orderDetails.paymentMethod}
                  onChange={(e) => handleOrderDetailsChange('paymentMethod', e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="online">Online Payment</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Special Instructions (Optional)"
                value={orderDetails.notes}
                onChange={(e) => handleOrderDetailsChange('notes', e.target.value)}
                margin="normal"
                multiline
                rows={2}
              />
            </CardContent>
          </Card>

          {/* Place Order Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePlaceOrder}
            disabled={loading || cart.items.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : <Payment />}
            sx={{
              py: 3,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 3,
              background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e55a2b 30%, #e8851a 90%)',
                boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, #ccc 30%, #999 90%)',
                boxShadow: 'none',
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Placing Order...' : `Place Order - ${formatCurrency(totals.total)}`}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
