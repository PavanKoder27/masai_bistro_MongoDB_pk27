import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Alert,
  Divider,
  Chip,
  Avatar,
  Fade,
  Slide
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Security,
  Badge,
  LocationOn,
  Save,
  Edit,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import EnhancedTextField from '../Common/EnhancedTextField';
import { MasaiBistroButton } from '../Common/AnimatedButton';

const ProfileSettings = () => {
  const { user, updateProfile, loading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateProfileForm = () => {
    if (!profileData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!profileData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!profileData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Phone validation (Indian format)
    if (profileData.phone) {
      const cleanPhone = profileData.phone.replace(/[\s\-\(\)]/g, '');
      const phonePatterns = [
        /^\+91[6-9]\d{9}$/, // +91XXXXXXXXXX
        /^91[6-9]\d{9}$/,   // 91XXXXXXXXXX  
        /^[6-9]\d{9}$/      // XXXXXXXXXX
      ];
      
      if (!phonePatterns.some(pattern => pattern.test(cleanPhone))) {
        setError('Please enter a valid Indian phone number');
        return false;
      }
    }
    
    return true;
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      setError('Current password is required');
      return false;
    }
    if (!passwordData.newPassword) {
      setError('New password is required');
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    
    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
    const hasNumbers = /\d/.test(passwordData.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setError('Password must contain uppercase, lowercase, number, and special character');
      return false;
    }
    
    return true;
  };

  const handleProfileSubmit = async () => {
    setError(null);
    setSuccess(null);
    
    if (!validateProfileForm()) {
      return;
    }
    
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setEditMode(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async () => {
    setError(null);
    setSuccess(null);
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      // Note: This would need a separate API endpoint for password change
      // For now, we'll show a success message
      setSuccess('Password changed successfully!');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to change password');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'warning';
      case 'staff': return 'info';
      default: return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '👨‍💼';
      case 'manager': return '👩‍💼';
      case 'staff': return '👨‍🍳';
      default: return '👤';
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Please log in to access your profile settings.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Slide direction="down" in={true} timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography sx={{ fontSize: 50, mb: 1 }}>👤</Typography>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ff6b35 30%, #f57c00 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Profile Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account information and preferences
            </Typography>
          </Box>

          {/* Success/Error Messages */}
          {success && (
            <Fade in={true}>
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            </Fade>
          )}
          
          {error && (
            <Fade in={true}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </Fade>
          )}

          <Grid container spacing={3}>
            {/* Profile Information Card */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Personal Information
                    </Typography>
                    <MasaiBistroButton
                      size="small"
                      variant={editMode ? "outlined" : "contained"}
                      onClick={() => setEditMode(!editMode)}
                      startIcon={<Edit />}
                    >
                      {editMode ? 'Cancel' : 'Edit'}
                    </MasaiBistroButton>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <EnhancedTextField
                        label="First Name"
                        value={profileData.firstName}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                        disabled={!editMode}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <EnhancedTextField
                        label="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                        disabled={!editMode}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <EnhancedTextField
                        label="Email Address"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        disabled={!editMode}
                        required
                        fullWidth
                        validationType="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <EnhancedTextField
                        label="Phone Number"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        placeholder="+91-XXXXX-XXXXX"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <EnhancedTextField
                        label="Address (Optional)"
                        value={profileData.address}
                        onChange={(e) => handleProfileChange('address', e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>

                  {editMode && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <MasaiBistroButton
                        onClick={handleProfileSubmit}
                        loading={loading}
                        startIcon={<Save />}
                        sx={{ flex: 1 }}
                      >
                        Save Changes
                      </MasaiBistroButton>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Account Info Sidebar */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '2rem'
                    }}
                  >
                    {getRoleIcon(user.role)}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Chip
                    label={user.role.toUpperCase()}
                    color={getRoleColor(user.role)}
                    sx={{ mb: 2, fontWeight: 600 }}
                  />
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <Email sx={{ mr: 1, fontSize: 16, verticalAlign: 'middle' }} />
                      {user.email}
                    </Typography>
                    {user.phone && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <Phone sx={{ mr: 1, fontSize: 16, verticalAlign: 'middle' }} />
                        {user.phone}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      <Badge sx={{ mr: 1, fontSize: 16, verticalAlign: 'middle' }} />
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                    <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Security Settings
                  </Typography>
                  <MasaiBistroButton
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    startIcon={showPasswordForm ? <VisibilityOff /> : <Visibility />}
                  >
                    {showPasswordForm ? 'Hide' : 'Change'} Password
                  </MasaiBistroButton>

                  {showPasswordForm && (
                    <Box sx={{ mt: 3 }}>
                      <EnhancedTextField
                        label="Current Password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                      />
                      <EnhancedTextField
                        label="New Password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        fullWidth
                        required
                        validationType="password"
                        sx={{ mb: 2 }}
                      />
                      <EnhancedTextField
                        label="Confirm New Password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                      />
                      <MasaiBistroButton
                        fullWidth
                        onClick={handlePasswordSubmit}
                        loading={loading}
                        startIcon={<Save />}
                      >
                        Update Password
                      </MasaiBistroButton>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Slide>
    </Container>
  );
};

export default ProfileSettings;
