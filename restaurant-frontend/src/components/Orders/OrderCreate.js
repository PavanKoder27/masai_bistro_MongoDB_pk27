import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Add, Remove, Delete, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { menuAPI, ordersAPI, formatCurrency } from '../../services/api';

const OrderCreate = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [orderDetails, setOrderDetails] = useState({
    orderType: 'dine_in',
    tableNumber: '',
    paymentMethod: 'card',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);
      const response = await menuAPI.getMenuItems({ limit: 100 });
      setMenuItems(response.data.data.filter(item => item.availability));
    } catch (err) {
      setError('Failed to fetch menu items');
    } finally {
      setMenuLoading(false);
    }
  };

  const handleCustomerChange = (field) => (event) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleOrderDetailsChange = (field) => (event) => {
    setOrderDetails(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const addToOrder = (menuItem) => {
    const existingItem = orderItems.find(item => item.menuItem._id === menuItem._id);
    
    if (existingItem) {
      setOrderItems(prev =>
        prev.map(item =>
          item.menuItem._id === menuItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems(prev => [
        ...prev,
        {
          menuItem,
          quantity: 1,
          specialInstructions: '',
        }
      ]);
    }
  };

  const updateQuantity = (menuItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromOrder(menuItemId);
      return;
    }

    setOrderItems(prev =>
      prev.map(item =>
        item.menuItem._id === menuItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromOrder = (menuItemId) => {
    setOrderItems(prev => prev.filter(item => item.menuItem._id !== menuItemId));
  };

  const updateSpecialInstructions = (menuItemId, instructions) => {
    setOrderItems(prev =>
      prev.map(item =>
        item.menuItem._id === menuItemId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    );
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.menuItem.price * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST for India
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };



  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      setError('Customer name is required');
      return false;
    }
    if (!customerInfo.phone.trim()) {
      setError('Customer phone is required');
      return false;
    }
    if (orderItems.length === 0) {
      setError('Please add at least one item to the order');
      return false;
    }
    if (orderDetails.orderType === 'dine_in' && !orderDetails.tableNumber) {
      setError('Table number is required for dine-in orders');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        customer: customerInfo,
        items: orderItems.map(item => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        })),
        orderType: orderDetails.orderType,
        tableNumber: orderDetails.orderType === 'dine_in' ? parseInt(orderDetails.tableNumber) : undefined,
        paymentMethod: orderDetails.paymentMethod,
        notes: orderDetails.notes,
      };

      await ordersAPI.createOrder(orderData);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (menuLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/orders')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Create New Order
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Customer Name"
                      value={customerInfo.name}
                      onChange={handleCustomerChange('name')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={customerInfo.phone}
                      onChange={handleCustomerChange('phone')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email (optional)"
                      type="email"
                      value={customerInfo.email}
                      onChange={handleCustomerChange('email')}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Order Type</InputLabel>
                      <Select
                        value={orderDetails.orderType}
                        label="Order Type"
                        onChange={handleOrderDetailsChange('orderType')}
                      >
                        <MenuItem value="dine_in">Dine In</MenuItem>
                        <MenuItem value="takeout">Takeout</MenuItem>
                        <MenuItem value="delivery">Delivery</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {orderDetails.orderType === 'dine_in' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Table Number"
                        type="number"
                        value={orderDetails.tableNumber}
                        onChange={handleOrderDetailsChange('tableNumber')}
                        required
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        value={orderDetails.paymentMethod}
                        label="Payment Method"
                        onChange={handleOrderDetailsChange('paymentMethod')}
                      >
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="card">Card</MenuItem>
                        <MenuItem value="online">Online</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Order Notes (optional)"
                      multiline
                      rows={2}
                      value={orderDetails.notes}
                      onChange={handleOrderDetailsChange('notes')}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Menu Items */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Menu Items
                </Typography>
                <Grid container spacing={2}>
                  {menuItems.map((item) => (
                    <Grid item xs={12} sm={6} key={item._id}>
                      <Card variant="outlined">
                        <CardContent sx={{ pb: 1 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {item.description}
                          </Typography>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" color="primary">
                              {formatCurrency(item.price)}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => addToOrder(item)}
                            >
                              Add
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                
                {orderItems.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No items added yet
                  </Typography>
                ) : (
                  <>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell align="center">Qty</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderItems.map((item) => (
                            <TableRow key={item.menuItem._id}>
                              <TableCell>
                                <Typography variant="body2">
                                  {item.menuItem.name}
                                </Typography>
                                <TextField
                                  size="small"
                                  placeholder="Special instructions"
                                  value={item.specialInstructions}
                                  onChange={(e) => updateSpecialInstructions(item.menuItem._id, e.target.value)}
                                  sx={{ mt: 1, width: '100%' }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Box display="flex" alignItems="center" justifyContent="center">
                                  <IconButton
                                    size="small"
                                    onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                                  >
                                    <Remove />
                                  </IconButton>
                                  <Typography sx={{ mx: 1 }}>
                                    {item.quantity}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                                  >
                                    <Add />
                                  </IconButton>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(item.menuItem.price * item.quantity)}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => removeFromOrder(item.menuItem._id)}
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Divider sx={{ my: 2 }} />

                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Subtotal:</Typography>
                        <Typography>{formatCurrency(calculateSubtotal())}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>GST (18%):</Typography>
                        <Typography>{formatCurrency(calculateTax())}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6" color="primary">
                          {formatCurrency(calculateTotal())}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleSubmit}
                      disabled={loading || orderItems.length === 0}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Create Order'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default OrderCreate;
