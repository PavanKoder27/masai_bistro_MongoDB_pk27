import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);

          // Validate token by checking if it's expired
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;

          if (tokenPayload.exp && tokenPayload.exp > currentTime) {
            // Token is still valid
            setUser(userData);
          } else {
            // Token expired, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (err) {
          // Invalid token or user data, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    // Listen for auth logout events from API interceptor
    const handleAuthLogout = () => {
      setUser(null);
      setError(null);
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    initializeAuth();

    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.login(credentials);

      if (response.data.success) {
        const { user: userData, token } = response.data.data;

        // Store user and token
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return {
          success: true,
          message: response.data.message || 'Login successful',
          user: userData
        };
      } else {
        const errorMessage = response.data.message || 'Login failed';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
          errors: response.data.errors
        };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      const errors = err.response?.data?.errors || {};
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        errors: errors
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.register(userData);
      const { user: newUser, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => setError(null);

  const isAuthenticated = !!user && !!localStorage.getItem('token');
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isStaff = user?.role === 'staff' || user?.role === 'manager' || user?.role === 'admin';

  // Debug logging for authentication state
  React.useEffect(() => {
    console.log('🔐 Auth State Debug:', {
      user: user ? `${user.firstName} ${user.lastName} (${user.role})` : null,
      isAuthenticated,
      loading,
      hasToken: !!localStorage.getItem('token'),
      timestamp: new Date().toISOString()
    });
  }, [user, isAuthenticated, loading]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated,
    isAdmin,
    isManager,
    isStaff,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
