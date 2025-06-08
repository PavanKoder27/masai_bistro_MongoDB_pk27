import React, { useState, useEffect } from 'react';
import {
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
} from '@mui/icons-material';
import { menuAPI, formatCurrency } from '../../services/api';
import MenuItemDialog from '../Menu/MenuItemDialog';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showUnavailable, setShowUnavailable] = useState(true);
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [searchTerm, selectedCategory, showUnavailable]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        category: selectedCategory,
        limit: 100,
      };

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await menuAPI.getMenuItems(params);
      let items = response.data.data;

      // Filter by availability if needed
      if (!showUnavailable) {
        items = items.filter(item => item.availability);
      }

      setMenuItems(items);
      setError(null);
    } catch (err) {
      setError('Failed to fetch menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await menuAPI.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDeleteItem = async (item) => {
    if (deleteConfirm === item._id) {
      try {
        await menuAPI.deleteMenuItem(item._id);
        fetchMenuItems();
        setDeleteConfirm(null);
      } catch (err) {
        setError('Failed to delete menu item');
      }
    } else {
      setDeleteConfirm(item._id);
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await menuAPI.updateMenuItem(item._id, {
        ...item,
        availability: !item.availability,
      });
      fetchMenuItems();
    } catch (err) {
      setError('Failed to update item availability');
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleItemSaved = () => {
    fetchMenuItems();
    handleDialogClose();
  };



  const getTagColor = (tag) => {
    const colors = {
      vegan: 'success',
      vegetarian: 'success',
      'gluten-free': 'info',
      mild: 'success',
      medium: 'warning',
      spicy: 'error',
      'very spicy': 'error',
      'dairy-free': 'warning',
      'nut-free': 'secondary',
      popular: 'primary',
      new: 'primary',
    };
    return colors[tag] || 'default';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Menu Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddItem}
        >
          Add Menu Item
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
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.replace('_', ' ').toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showUnavailable}
                    onChange={(e) => setShowUnavailable(e.target.checked)}
                  />
                }
                label="Show Unavailable"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                {menuItems.length} items
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : menuItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No menu items found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              menuItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.category.replace('_', ' ').toUpperCase()}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold">
                      {formatCurrency(item.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {item.tags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          color={getTagColor(tag)}
                          variant="outlined"
                        />
                      ))}
                      {item.tags.length > 3 && (
                        <Chip
                          label={`+${item.tags.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.availability}
                      onChange={() => handleToggleAvailability(item)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Item">
                        <IconButton
                          size="small"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={deleteConfirm === item._id ? "Click again to confirm" : "Delete Item"}>
                        <IconButton
                          size="small"
                          color={deleteConfirm === item._id ? "error" : "default"}
                          onClick={() => handleDeleteItem(item)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <MenuItemDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleItemSaved}
        item={editingItem}
        categories={categories}
      />
    </Box>
  );
};

export default MenuManagement;
