import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Fade,
  Slide,
  Zoom,
  Divider,
} from '@mui/material';
import { Restaurant, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import EnhancedTextField from '../Common/EnhancedTextField';
import AnimatedButton, { MasaiBistroButton } from '../Common/AnimatedButton';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/menu';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    // Navigation will be handled by useEffect when isAuthenticated changes
    // No need to navigate here to avoid potential loops
  };

  return (
    <Container component="main" maxWidth="xs">
      <Slide direction="down" in={true} timeout={800}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Zoom in={true} timeout={1000}>
            <Paper
              elevation={8}
              sx={{
                padding: 4,
                width: '100%',
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                borderRadius: 3,
                boxShadow: '0 10px 40px rgba(255, 107, 53, 0.1)',
                border: '1px solid rgba(255, 107, 53, 0.1)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Fade in={true} timeout={1200}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography sx={{ fontSize: 50, mb: 1 }}>🍛</Typography>
                    <Typography
                      component="h1"
                      variant="h3"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #ff6b35 30%, #f57c00 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      MASAI BISTRO
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                      <Restaurant sx={{ mr: 1, verticalAlign: 'middle', color: '#ff6b35' }} />
                      Authentic Indian Restaurant Management
                    </Typography>
                    <Divider sx={{ my: 2, bgcolor: '#ff6b35', height: 2, borderRadius: 1 }} />
                  </Box>
                </Fade>

                {error && (
                  <Fade in={true}>
                    <Alert
                      severity="error"
                      sx={{
                        width: '100%',
                        mb: 2,
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          color: '#d32f2f'
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                  <Fade in={true} timeout={1400}>
                    <Box sx={{ mb: 2 }}>
                      <EnhancedTextField
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                        validationType="email"
                        required
                        autoComplete="email"
                        autoFocus
                        disabled={loading}
                        placeholder="Enter your email address"
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  </Fade>

                  <Fade in={true} timeout={1600}>
                    <Box sx={{ mb: 3 }}>
                      <EnhancedTextField
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                        type="password"
                        validationType="password"
                        required
                        autoComplete="current-password"
                        disabled={loading}
                        placeholder="Enter your password"
                      />
                    </Box>
                  </Fade>

                  <Fade in={true} timeout={1800}>
                    <MasaiBistroButton
                      type="submit"
                      fullWidth
                      loading={loading}
                      animationType="shimmer"
                      sx={{
                        mt: 2,
                        mb: 3,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      Sign In to Masai Bistro
                    </MasaiBistroButton>
                  </Fade>
                  <Fade in={true} timeout={2000}>
                    <Box textAlign="center">
                      <Link to="/register" style={{ textDecoration: 'none' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#ff6b35',
                            fontWeight: 500,
                            '&:hover': {
                              textDecoration: 'underline',
                              color: '#e55a2b'
                            }
                          }}
                        >
                          Don't have an account? Sign Up
                        </Typography>
                      </Link>
                    </Box>
                  </Fade>
                </Box>


              </Box>
            </Paper>
          </Zoom>
        </Box>
      </Slide>
    </Container>
  );
};

export default Login;
