import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Divider,
  ButtonGroup,
  Snackbar,
  Alert,
  CardMedia,
} from '@mui/material';
import { Edit, AccessTime, Restaurant, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { formatCurrency } from '../../services/api';
import { CompactDietaryIndicators } from '../Common/DietaryIndicators';
import { useCart } from '../../contexts/CartContext';

const MenuItemCard = ({ item, onEdit }) => {
  const { addToCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const quantity = getItemQuantity(item._id);
  const getTagColor = (tag) => {
    const colors = {
      vegan: 'success',
      vegetarian: 'success',
      'gluten-free': 'info',
      spicy: 'error',
      mild: 'success',
      medium: 'warning',
      'very spicy': 'error',
      'dairy-free': 'warning',
      'nut-free': 'secondary',
      popular: 'primary',
      new: 'primary',
      'street-food': 'warning',
      'tandoori': 'error',
      'signature': 'secondary',
      'creamy': 'info',
    };
    return colors[tag] || 'default';
  };

  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      appetizer: 'Appetizer',
      main_course: 'Main Course',
      bread: 'Indian Breads',
      beverage: 'Beverages',
      dessert: 'Desserts'
    };
    return categoryNames[category] || category.replace('_', ' ').toUpperCase();
  };

  const handleAddToCart = () => {
    addToCart(item, 1);
    setShowSuccess(true);
  };

  const handleIncrement = () => {
    updateQuantity(item._id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(item._id, quantity - 1);
    } else {
      removeFromCart(item._id);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      {!item.availability && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <Chip
            label="Unavailable"
            color="error"
            size="small"
          />
        </Box>
      )}

      {/* Dish Image */}
      {item.image && (
        <CardMedia
          component="img"
          height="200"
          image={item.image}
          alt={item.name}
          sx={{
            objectFit: 'cover',
            filter: !item.availability ? 'grayscale(100%)' : 'none',
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h2" gutterBottom>
            {item.name}
          </Typography>
          {onEdit && (
            <Tooltip title="Edit Item">
              <IconButton
                size="small"
                onClick={() => onEdit(item)}
                sx={{ ml: 1 }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: '40px' }}
        >
          {item.description || 'No description available'}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {formatCurrency(item.price)}
          </Typography>
          <Chip
            label={getCategoryDisplayName(item.category)}
            size="small"
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: 500,
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
              borderColor: '#ff6b35'
            }}
          />
        </Box>

        {/* Dietary Indicators */}
        <Box mb={2}>
          <CompactDietaryIndicators item={item} />
        </Box>

        {item.preparationTime && (
          <Box display="flex" alignItems="center" mb={2}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              {item.preparationTime} min
            </Typography>
          </Box>
        )}

        {item.ingredients && item.ingredients.length > 0 && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Ingredients:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.ingredients.join(', ')}
            </Typography>
          </Box>
        )}

        {item.nutritionalInfo && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Nutrition (per serving):</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.nutritionalInfo.calories && `${item.nutritionalInfo.calories} cal`}
              {item.nutritionalInfo.protein && ` • ${item.nutritionalInfo.protein}g protein`}
              {item.nutritionalInfo.carbs && ` • ${item.nutritionalInfo.carbs}g carbs`}
              {item.nutritionalInfo.fat && ` • ${item.nutritionalInfo.fat}g fat`}
            </Typography>
          </Box>
        )}

        {item.tags && item.tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {item.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                color={getTagColor(tag)}
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        {!item.availability ? (
          <Button
            variant="contained"
            color="error"
            disabled
            fullWidth
          >
            Unavailable
          </Button>
        ) : quantity > 0 ? (
          <Box display="flex" alignItems="center" width="100%" gap={1}>
            <ButtonGroup variant="outlined" size="small">
              <IconButton onClick={handleDecrement} size="small">
                <Remove />
              </IconButton>
              <Button disabled sx={{ minWidth: '40px' }}>
                {quantity}
              </Button>
              <IconButton onClick={handleIncrement} size="small">
                <Add />
              </IconButton>
            </ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<ShoppingCart />}
              sx={{ ml: 1 }}
            >
              In Cart (₹{(item.price * quantity).toFixed(2)})
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            fullWidth
            startIcon={<ShoppingCart />}
            sx={{
              background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e55a2b 30%, #e8851a 90%)',
              }
            }}
          >
            Add to Cart
          </Button>
        )}
      </CardActions>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {item.name} added to cart!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default MenuItemCard;
