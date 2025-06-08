import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Alert,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Snackbar,
  Chip,
} from '@mui/material';
import {
  Settings,
  Save,
  Refresh,
  ExpandMore,
  Store,
  AttachMoney,
  Schedule,
  Info,
  Phone,
  Email,
  LocationOn,
  Restore,
  Restaurant,
} from '@mui/icons-material';
import { settingsAPI, formatCurrency } from '../../services/api';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    restaurantName: 'MASAI BISTRO',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    },
    phone: '',
    email: '',
    description: '',
    cuisineType: 'Indian',
    operatingHours: [],
    financialSettings: {
      currency: 'INR',
      currencySymbol: '₹',
      gstRate: 18,
      serviceChargeRate: 0,
      minimumOrderAmount: 200,
      deliveryCharges: 50,
      paymentMethods: []
    },
    timezone: 'Asia/Kolkata'
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const paymentMethodOptions = ['cash', 'card', 'upi', 'netbanking', 'wallet'];
  const currencyOptions = [
    { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
    { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'GBP', label: 'British Pound (£)', symbol: '£' }
  ];

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getSettings();
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage('Failed to load settings');
      setMessageType('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field) => (event) => {
    setSettings(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: event.target.value
      }
    }));
  };

  const handleFinancialChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      financialSettings: {
        ...prev.financialSettings,
        [field]: value
      }
    }));
  };

  const handleHoursChange = (dayIndex, field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => {
      const newOperatingHours = [...prev.operatingHours];
      if (newOperatingHours[dayIndex]) {
        newOperatingHours[dayIndex] = {
          ...newOperatingHours[dayIndex],
          [field]: value
        };
      }
      return {
        ...prev,
        operatingHours: newOperatingHours
      };
    });
  };

  const handlePaymentMethodsChange = (event) => {
    const value = event.target.value;
    setSettings(prev => ({
      ...prev,
      financialSettings: {
        ...prev.financialSettings,
        paymentMethods: typeof value === 'string' ? value.split(',') : value
      }
    }));
  };

  const handleCurrencyChange = (event) => {
    const selectedCurrency = currencyOptions.find(c => c.value === event.target.value);
    setSettings(prev => ({
      ...prev,
      financialSettings: {
        ...prev.financialSettings,
        currency: selectedCurrency.value,
        currencySymbol: selectedCurrency.symbol
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await settingsAPI.updateSettings(settings);
      if (response.data.success) {
        setMessage('Settings saved successfully!');
        setMessageType('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage(error.response?.data?.message || 'Failed to save settings');
      setMessageType('error');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      const response = await settingsAPI.resetSettings();
      if (response.data.success) {
        setSettings(response.data.data);
        setMessage('Settings reset to default values');
        setMessageType('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      setMessage('Failed to reset settings');
      setMessageType('error');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Settings sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            MASAI BISTRO Settings
          </Typography>
        </Box>

        {/* Restaurant Details Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center">
              <Store sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Restaurant Details
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Restaurant Name"
                  value={settings.restaurantName}
                  onChange={handleChange('restaurantName')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Restaurant sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cuisine Type"
                  value={settings.cuisineType}
                  onChange={handleChange('cuisineType')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Restaurant Description"
                  multiline
                  rows={3}
                  value={settings.description}
                  onChange={handleChange('description')}
                  placeholder="Describe your restaurant's atmosphere, specialties, and unique features..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Info sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Address Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                  Address Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={settings.address?.street || ''}
                  onChange={handleAddressChange('street')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={settings.address?.city || ''}
                  onChange={handleAddressChange('city')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={settings.address?.state || ''}
                  onChange={handleAddressChange('state')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={settings.address?.postalCode || ''}
                  onChange={handleAddressChange('postalCode')}
                  placeholder="6-digit PIN code"
                />
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={settings.phone}
                  onChange={handleChange('phone')}
                  placeholder="+91 9876543210"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={settings.email}
                  onChange={handleChange('email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Financial Settings Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center">
              <AttachMoney sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Financial Settings
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={settings.financialSettings?.currency || 'INR'}
                    label="Currency"
                    onChange={handleCurrencyChange}
                  >
                    {currencyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GST/Tax Rate (%)"
                  type="number"
                  value={settings.financialSettings?.gstRate || 18}
                  onChange={handleFinancialChange('gstRate')}
                  inputProps={{ step: 0.1, min: 0, max: 100 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Service Charge (%)"
                  type="number"
                  value={settings.financialSettings?.serviceChargeRate || 0}
                  onChange={handleFinancialChange('serviceChargeRate')}
                  inputProps={{ step: 0.1, min: 0, max: 100 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Order Amount"
                  type="number"
                  value={settings.financialSettings?.minimumOrderAmount || 200}
                  onChange={handleFinancialChange('minimumOrderAmount')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {settings.financialSettings?.currencySymbol || '₹'}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Delivery Charges"
                  type="number"
                  value={settings.financialSettings?.deliveryCharges || 50}
                  onChange={handleFinancialChange('deliveryCharges')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {settings.financialSettings?.currencySymbol || '₹'}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Methods</InputLabel>
                  <Select
                    multiple
                    value={settings.financialSettings?.paymentMethods || []}
                    onChange={handlePaymentMethodsChange}
                    input={<OutlinedInput label="Payment Methods" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value.toUpperCase()} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {paymentMethodOptions.map((method) => (
                      <MenuItem key={method} value={method}>
                        <Checkbox
                          checked={(settings.financialSettings?.paymentMethods || []).indexOf(method) > -1}
                        />
                        <ListItemText primary={method.toUpperCase()} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Operating Hours Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center">
              <Schedule sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Operating Hours
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {daysOfWeek.map((day, index) => {
                const dayHours = settings.operatingHours?.[index] || {
                  day,
                  isOpen: true,
                  openTime: '10:00',
                  closeTime: '22:00'
                };

                return (
                  <Grid item xs={12} key={day}>
                    <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                            {day}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            fullWidth
                            type="time"
                            label="Open Time"
                            value={dayHours.openTime}
                            onChange={handleHoursChange(index, 'openTime')}
                            disabled={!dayHours.isOpen}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            fullWidth
                            type="time"
                            label="Close Time"
                            value={dayHours.closeTime}
                            onChange={handleHoursChange(index, 'closeTime')}
                            disabled={!dayHours.isOpen}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={dayHours.isOpen}
                                onChange={handleHoursChange(index, 'isOpen')}
                                color="primary"
                              />
                            }
                            label={dayHours.isOpen ? "Open" : "Closed"}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSave}
            disabled={saving}
            size="large"
            sx={{
              minWidth: 200,
              background: 'linear-gradient(45deg, #ff6b35 30%, #ff8a50 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e55a2b 30%, #ff7a40 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
              },
            }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Restore />}
            onClick={handleReset}
            disabled={saving}
            size="large"
            sx={{
              minWidth: 200,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'rgba(255, 107, 53, 0.04)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="text"
            startIcon={<Refresh />}
            onClick={fetchSettings}
            disabled={saving}
            size="large"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={messageType}
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default SystemSettings;
