import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Menu from './components/Menu/Menu';
import Cart from './components/Cart/Cart';
import Orders from './components/Orders/Orders';
import OrderCreate from './components/Orders/OrderCreate';
import Dashboard from './components/Dashboard/Dashboard';
import AdminPanel from './components/Admin/AdminPanel';
import ProfileSettings from './components/Profile/ProfileSettings';
import APIDebug from './components/Debug/APIDebug';
import SimpleTest from './components/Debug/SimpleTest';
import ProtectedRoute from './components/Auth/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b35', // Saffron orange - representing Indian saffron
      light: '#ff9a66',
      dark: '#cc4a1a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d32f2f', // Deep red - representing Indian spices
      light: '#ff6659',
      dark: '#9a0007',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32', // Green for vegetarian indicators
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#f57c00', // Orange for medium spice level
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#c62828', // Red for hot spice level
      light: '#f44336',
      dark: '#8e0000',
    },
    background: {
      default: '#fdf6e3', // Warm cream background - like Indian parchment
      paper: '#ffffff',
      accent: '#fff8e1', // Light saffron background
    },
    text: {
      primary: '#2c1810', // Dark brown - like rich Indian soil
      secondary: '#5d4037', // Medium brown - like cinnamon
      disabled: '#8d6e63',
    },
    divider: '#d7ccc8', // Light brown dividers
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans Devanagari", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#d32f2f',
      fontSize: '2.5rem',
      letterSpacing: '0.02em',
    },
    h2: {
      fontWeight: 600,
      color: '#ff6b35',
      fontSize: '2rem',
      letterSpacing: '0.01em',
    },
    h3: {
      fontWeight: 600,
      color: '#ff6b35',
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      color: '#ff6b35',
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    subtitle1: {
      fontWeight: 500,
      color: '#5d4037',
    },
    subtitle2: {
      fontWeight: 400,
      color: '#5d4037',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #ff6b35 30%, #ff8a50 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #e55a2b 30%, #ff7a40 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/menu" replace />} />
              <Route path="menu" element={<Menu />} />
              <Route path="cart" element={<Cart />} />
              <Route
                path="orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/new"
                element={
                  <ProtectedRoute>
                    <OrderCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute requireManager>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin"
                element={
                  <ProtectedRoute requireManager>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />
              <Route path="debug" element={<APIDebug />} />
              <Route path="test" element={<SimpleTest />} />
            </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
