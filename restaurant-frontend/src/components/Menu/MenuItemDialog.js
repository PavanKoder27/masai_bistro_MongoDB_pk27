import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { menuAPI } from '../../services/api';

const MenuItemDialog = ({ open, onClose, onSave, item, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    ingredients: [],
    tags: [],
    availability: true,
    preparationTime: '',
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    },
  });
  const [ingredientInput, setIngredientInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableTags = [
    'vegan', 'vegetarian', 'gluten-free', 'mild', 'medium', 'spicy', 'very spicy',
    'dairy-free', 'nut-free', 'popular', 'new'
  ];

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        category: item.category || '',
        price: item.price || '',
        ingredients: item.ingredients || [],
        tags: item.tags || [],
        availability: item.availability !== undefined ? item.availability : true,
        preparationTime: item.preparationTime || '',
        nutritionalInfo: {
          calories: item.nutritionalInfo?.calories || '',
          protein: item.nutritionalInfo?.protein || '',
          carbs: item.nutritionalInfo?.carbs || '',
          fat: item.nutritionalInfo?.fat || '',
        },
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        ingredients: [],
        tags: [],
        availability: true,
        preparationTime: '',
        nutritionalInfo: {
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
        },
      });
    }
    setError(null);
  }, [item, open]);

  const handleChange = (field) => (event) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: event.target.value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    }
  };

  const handleSwitchChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !formData.ingredients.includes(ingredientInput.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }));
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing !== ingredient),
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare data for submission
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
        nutritionalInfo: {
          calories: formData.nutritionalInfo.calories ? parseInt(formData.nutritionalInfo.calories) : undefined,
          protein: formData.nutritionalInfo.protein ? parseFloat(formData.nutritionalInfo.protein) : undefined,
          carbs: formData.nutritionalInfo.carbs ? parseFloat(formData.nutritionalInfo.carbs) : undefined,
          fat: formData.nutritionalInfo.fat ? parseFloat(formData.nutritionalInfo.fat) : undefined,
        },
      };

      // Remove undefined values from nutritionalInfo
      Object.keys(submitData.nutritionalInfo).forEach(key => {
        if (submitData.nutritionalInfo[key] === undefined) {
          delete submitData.nutritionalInfo[key];
        }
      });

      if (item) {
        await menuAPI.updateMenuItem(item._id, submitData);
      } else {
        await menuAPI.createMenuItem(submitData);
      }

      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddIngredient();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {item ? 'Edit Menu Item' : 'Add New Menu Item'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={handleChange('category')}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange('price')}
              required
              inputProps={{ step: 0.01, min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Preparation Time (minutes)"
              type="number"
              value={formData.preparationTime}
              onChange={handleChange('preparationTime')}
              inputProps={{ min: 1 }}
            />
          </Grid>

          {/* Ingredients */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Ingredients
            </Typography>
            <Box display="flex" gap={1} mb={1}>
              <TextField
                fullWidth
                placeholder="Add ingredient"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button variant="outlined" onClick={handleAddIngredient}>
                Add
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.ingredients.map((ingredient) => (
                <Chip
                  key={ingredient}
                  label={ingredient}
                  onDelete={() => handleRemoveIngredient(ingredient)}
                />
              ))}
            </Box>
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {availableTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagToggle(tag)}
                  color={formData.tags.includes(tag) ? 'primary' : 'default'}
                  variant={formData.tags.includes(tag) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>

          {/* Nutritional Info */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Nutritional Information (per serving)
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Calories"
              type="number"
              value={formData.nutritionalInfo.calories}
              onChange={handleChange('nutritionalInfo.calories')}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Protein (g)"
              type="number"
              value={formData.nutritionalInfo.protein}
              onChange={handleChange('nutritionalInfo.protein')}
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Carbs (g)"
              type="number"
              value={formData.nutritionalInfo.carbs}
              onChange={handleChange('nutritionalInfo.carbs')}
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Fat (g)"
              type="number"
              value={formData.nutritionalInfo.fat}
              onChange={handleChange('nutritionalInfo.fat')}
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.availability}
                  onChange={handleSwitchChange('availability')}
                />
              }
              label="Available"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.name || !formData.category || !formData.price}
        >
          {loading ? <CircularProgress size={24} /> : (item ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MenuItemDialog;
