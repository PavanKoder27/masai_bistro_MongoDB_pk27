import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
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
  InputAdornment,
  Pagination,
} from '@mui/material';
import { Search, Add, FilterList, Restaurant, LocationOn } from '@mui/icons-material';
import { menuAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import MenuItemCard from './MenuItemCard';
import MenuItemDialog from './MenuItemDialog';
import { DietaryLegend } from '../Common/DietaryIndicators';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50, // Increased to show all items
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const { isManager } = useAuth();

  const availableTags = [
    'vegetarian', 'vegan', 'gluten-free', 'popular', 'new', 'signature',
    'mild', 'medium', 'hot', 'very_hot', 'street-food', 'tandoori', 'creamy'
  ];

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching menu items with params:', {
        currentPage: pagination.currentPage,
        itemsPerPage: pagination.itemsPerPage,
        searchTerm,
        selectedCategory,
        selectedTags,
        priceRange
      });

      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: searchTerm,
        category: selectedCategory,
        tags: selectedTags.join(','),
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      };

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      console.log('📡 API call params:', params);
      const response = await menuAPI.getMenuItems(params);
      console.log('✅ Menu API response:', response.data);
      setMenuItems(response.data.data);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination,
      }));
      setError(null);
    } catch (err) {
      console.error('🔥 Menu API Error Details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      setError(`Failed to fetch menu items: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, searchTerm, selectedCategory, selectedTags, priceRange]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await menuAPI.getCategories();
      setCategories(response.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    console.log('🔄 Menu component mounted, fetching items...');
    fetchMenuItems();
    fetchCategories();
  }, [fetchMenuItems, fetchCategories]);

  // Add a simple retry mechanism
  const retryFetch = () => {
    console.log('🔄 Retrying menu fetch...');
    setError(null);
    fetchMenuItems();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      setPagination(prevPag => ({ ...prevPag, currentPage: 1 }));
      return newTags;
    });
  };

  const handlePriceRangeChange = (field) => (event) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, currentPage: value }));
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleItemSaved = () => {
    fetchMenuItems();
    handleDialogClose();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
    setPriceRange({ min: '', max: '' });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  if (loading && menuItems.length === 0) {
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
          <Box>
            <Typography variant="h3" component="h1" sx={{ color: '#d32f2f', fontWeight: 700 }}>
              🍛 Masai Bistro Menu
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#5d4037', mt: 1 }}>
              <Restaurant sx={{ mr: 1, verticalAlign: 'middle' }} />
              Authentic Indian Cuisine • Brigade Road, Bangalore
            </Typography>
          </Box>
          {isManager && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddItem}
            >
              Add Menu Item
            </Button>
          )}
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={retryFetch}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Search and Filters */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category === 'appetizer' ? '🥗 Appetizers' :
                     category === 'main_course' ? '🍛 Main Course' :
                     category === 'bread' ? '🫓 Indian Breads' :
                     category === 'beverage' ? '🥤 Beverages' :
                     category === 'dessert' ? '🍮 Desserts' :
                     category.replace('_', ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={1.5}>
            <TextField
              fullWidth
              label="Min Price"
              type="number"
              value={priceRange.min}
              onChange={handlePriceRangeChange('min')}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={6} md={1.5}>
            <TextField
              fullWidth
              label="Max Price"
              type="number"
              value={priceRange.max}
              onChange={handlePriceRangeChange('max')}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={clearFilters}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        {/* Dietary Legend */}
        <DietaryLegend />

        {/* Tags Filter */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#5d4037', fontWeight: 600 }}>
            🏷️ Filter by Tags:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {availableTags.map((tag) => (
              <Chip
                key={tag}
                label={tag === 'very_hot' ? 'Very Hot' : tag.replace('_', ' ')}
                onClick={() => handleTagToggle(tag)}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                sx={{
                  textTransform: 'capitalize',
                  '&.MuiChip-filled': {
                    backgroundColor: '#ff6b35',
                    color: 'white'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Results Info */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {menuItems.length} of {pagination.totalItems} items
        </Typography>

        {/* Menu Items Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : menuItems.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No menu items found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={4}
            sx={{
              mb: 4,
              '& .MuiGrid-item': {
                display: 'flex',
                alignItems: 'stretch'
              }
            }}
          >
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} lg={4} key={item._id}>
                <MenuItemCard
                  item={item}
                  onEdit={isManager ? () => handleEditItem(item) : null}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <MenuItemDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleItemSaved}
        item={editingItem}
        categories={categories}
      />
    </Container>
  );
};

export default Menu;
