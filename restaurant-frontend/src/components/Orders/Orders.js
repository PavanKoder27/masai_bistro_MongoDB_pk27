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
  Chip,
  Box,
  CircularProgress,
  Alert,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add,
  Visibility,
  Edit,
  Close,
  ExpandMore,
  ExpandLess,
  Person,
  Phone,
  Email,
  LocationOn,
  Restaurant,
  Receipt,
  TableRestaurant,
  DeliveryDining,
  ShoppingBag,
} from '@mui/icons-material';
import { ordersAPI, formatCurrency } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import OrderStatusDialog from './OrderStatusDialog';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    orderType: '',
    customerPhone: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const orderStatuses = [
    'placed', 'confirmed', 'in_preparation', 'ready', 'delivered', 'cancelled'
  ];

  const orderTypes = ['dine_in', 'takeout', 'delivery'];

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters,
      };

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await ordersAPI.getOrders(params);
      setOrders(response.data.data);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination,
      }));
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, currentPage: value }));
  };

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdated = () => {
    fetchOrders();
    handleStatusDialogClose();
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedOrder(null);
    setExpandedItems(false);
  };

  const toggleItemsExpansion = () => {
    setExpandedItems(!expandedItems);
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: 'info',
      confirmed: 'primary',
      in_preparation: 'warning',
      ready: 'success',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getOrderTypeIcon = (orderType) => {
    switch (orderType) {
      case 'dine_in':
        return <TableRestaurant />;
      case 'delivery':
        return <DeliveryDining />;
      case 'takeout':
        return <ShoppingBag />;
      default:
        return <Restaurant />;
    }
  };

  const getPaymentMethodIcon = (paymentMethod) => {
    switch (paymentMethod) {
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      case 'online':
        return '📱';
      default:
        return '💰';
    }
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      orderType: '',
      customerPhone: '',
      startDate: '',
      endDate: '',
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  if (loading && orders.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Orders Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/orders/new')}
          >
            New Order
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={handleFilterChange('status')}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {orderStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.replace('_', ' ').toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Order Type</InputLabel>
                  <Select
                    value={filters.orderType}
                    label="Order Type"
                    onChange={handleFilterChange('orderType')}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {orderTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.replace('_', ' ').toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Customer Phone"
                  value={filters.customerPhone}
                  onChange={handleFilterChange('customerPhone')}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={filters.startDate}
                  onChange={handleFilterChange('startDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={filters.endDate}
                  onChange={handleFilterChange('endDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  fullWidth
                  sx={{ height: '56px' }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Results Info */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {orders.length} of {pagination.totalItems} orders
        </Typography>

        {/* Orders Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary">
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {order.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.customer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customer.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.orderType.replace('_', ' ').toUpperCase()}
                        size="small"
                        variant="outlined"
                      />
                      {order.tableNumber && (
                        <Typography variant="caption" display="block">
                          Table {order.tableNumber}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(order.total)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <Tooltip title="Update Status">
                            <IconButton
                              size="small"
                              onClick={() => handleStatusUpdate(order)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>

      {/* Status Update Dialog */}
      <OrderStatusDialog
        open={statusDialogOpen}
        onClose={handleStatusDialogClose}
        onUpdate={handleStatusUpdated}
        order={selectedOrder}
      />

      {/* Order Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleDetailDialogClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Order Details - #{selectedOrder?.orderNumber}
            </Typography>
            <IconButton onClick={handleDetailDialogClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {selectedOrder && (
            <Grid container spacing={3}>
              {/* Order Information */}
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Order Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Order ID</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedOrder.orderNumber}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                      <Typography variant="body1">
                        {formatDate(selectedOrder.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip
                        label={selectedOrder.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(selectedOrder.status)}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Order Type</Typography>
                      <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                        {getOrderTypeIcon(selectedOrder.orderType)}
                        <Typography variant="body1">
                          {selectedOrder.orderType.replace('_', ' ').toUpperCase()}
                        </Typography>
                        {selectedOrder.tableNumber && (
                          <Chip
                            label={`Table ${selectedOrder.tableNumber}`}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                      <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                        <Typography variant="body1">
                          {getPaymentMethodIcon(selectedOrder.paymentMethod)} {selectedOrder.paymentMethod.toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Customer Information */}
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Customer Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedOrder.customer.name}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Phone sx={{ fontSize: 16 }} />
                        <Typography variant="body1">
                          {selectedOrder.customer.phone}
                        </Typography>
                      </Box>
                    </Box>
                    {selectedOrder.customer.email && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Email sx={{ fontSize: 16 }} />
                          <Typography variant="body1">
                            {selectedOrder.customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {selectedOrder.customer.address && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Delivery Address</Typography>
                        <Box display="flex" alignItems="flex-start" gap={1}>
                          <LocationOn sx={{ fontSize: 16, mt: 0.5 }} />
                          <Typography variant="body1">
                            {typeof selectedOrder.customer.address === 'string'
                              ? selectedOrder.customer.address
                              : `${selectedOrder.customer.address.street}, ${selectedOrder.customer.address.city}, ${selectedOrder.customer.address.zipCode}`
                            }
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Order Items */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" color="primary">
                        <Restaurant sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Order Items ({selectedOrder.items?.length || 0})
                      </Typography>
                      <Button
                        onClick={toggleItemsExpansion}
                        endIcon={expandedItems ? <ExpandLess /> : <ExpandMore />}
                        size="small"
                      >
                        {expandedItems ? 'Collapse' : 'Expand'} Items
                      </Button>
                    </Box>

                    <Collapse in={expandedItems}>
                      <List>
                        {selectedOrder.items?.map((item, index) => (
                          <React.Fragment key={index}>
                            <ListItem sx={{ px: 0 }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                                <Restaurant />
                              </Avatar>
                              <ListItemText
                                primary={
                                  <Typography variant="body1" fontWeight="bold">
                                    {item.menuItem?.name || 'Unknown Item'}
                                  </Typography>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                                    </Typography>
                                    {item.menuItem?.description && (
                                      <Typography variant="caption" color="text.secondary">
                                        {item.menuItem.description}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                              <Typography variant="body1" fontWeight="bold" color="primary">
                                {formatCurrency(item.subtotal)}
                              </Typography>
                            </ListItem>
                            {index < selectedOrder.items.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </Collapse>

                    {/* Order Summary */}
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Order Summary
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Subtotal:</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(selectedOrder.subtotal)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">GST (18%):</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(selectedOrder.tax)}
                        </Typography>
                      </Box>
                      {selectedOrder.tip > 0 && (
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Tip:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(selectedOrder.tip)}
                          </Typography>
                        </Box>
                      )}
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6" color="primary">Total:</Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {formatCurrency(selectedOrder.total)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Special Notes */}
                    {selectedOrder.notes && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Special Instructions:
                        </Typography>
                        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="body2">
                            {selectedOrder.notes}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          {selectedOrder?.status !== 'delivered' && selectedOrder?.status !== 'cancelled' && (
            <Button
              onClick={() => {
                handleDetailDialogClose();
                handleStatusUpdate(selectedOrder);
              }}
              variant="contained"
              startIcon={<Edit />}
            >
              Update Status
            </Button>
          )}
          <Button onClick={handleDetailDialogClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders;
