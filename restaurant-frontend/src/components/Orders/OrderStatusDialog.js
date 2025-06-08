import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { ordersAPI, formatCurrency } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const OrderStatusDialog = ({ open, onClose, onUpdate, order }) => {
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const orderStatuses = [
    { value: 'placed', label: 'Placed' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_preparation', label: 'In Preparation' },
    { value: 'ready', label: 'Ready' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  React.useEffect(() => {
    if (order) {
      setNewStatus(order.status);
      setNotes('');
      setError(null);
    }
  }, [order]);

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleUpdate = async () => {
    if (!newStatus || newStatus === order.status) {
      setError('Please select a different status');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updateData = {
        status: newStatus,
        updatedBy: `${user.firstName} ${user.lastName}`,
        notes: notes.trim() || undefined,
      };

      await ordersAPI.updateOrderStatus(order._id, updateData);
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError(null);

      const cancelData = {
        updatedBy: `${user.firstName} ${user.lastName}`,
        reason: notes.trim() || 'Cancelled by staff',
      };

      await ordersAPI.cancelOrder(order._id, cancelData);
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
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



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Update Order Status - {order.orderNumber}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Order Details */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Customer:</strong> {order.customer.name} ({order.customer.phone})
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Type:</strong> {order.orderType.replace('_', ' ').toUpperCase()}
            {order.tableNumber && ` - Table ${order.tableNumber}`}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Total:</strong> {formatCurrency(order.total)}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Created:</strong> {formatDate(order.createdAt)}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" component="span">
              <strong>Current Status:</strong>{' '}
            </Typography>
            <Chip
              label={order.status.replace('_', ' ').toUpperCase()}
              color={getStatusColor(order.status)}
              size="small"
            />
          </Box>
        </Box>

        {/* Order Items */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          {order.items.map((item, index) => (
            <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>{item.quantity}x</strong> {item.menuItem?.name || 'Unknown Item'}
              </Typography>
              {item.specialInstructions && (
                <Typography variant="caption" color="text.secondary">
                  Note: {item.specialInstructions}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Status History
            </Typography>
            {order.statusHistory.slice(-3).map((history, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <Chip
                    label={history.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(history.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {formatDate(history.timestamp)}
                  {history.updatedBy && ` by ${history.updatedBy}`}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Update Form */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>New Status</InputLabel>
          <Select
            value={newStatus}
            label="New Status"
            onChange={handleStatusChange}
            disabled={loading}
          >
            {orderStatuses.map((status) => (
              <MenuItem
                key={status.value}
                value={status.value}
                disabled={status.value === order.status}
              >
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Notes (optional)"
          multiline
          rows={3}
          value={notes}
          onChange={handleNotesChange}
          disabled={loading}
          placeholder="Add any notes about this status update..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <Button
            onClick={handleCancel}
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Cancel Order'}
          </Button>
        )}
        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={loading || !newStatus || newStatus === order.status}
        >
          {loading ? <CircularProgress size={20} /> : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderStatusDialog;
