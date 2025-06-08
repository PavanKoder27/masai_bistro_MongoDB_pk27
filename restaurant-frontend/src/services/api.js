import axios from 'axios';
import { formatCurrency } from '../utils/currencyFormatter';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      // Let the AuthContext handle the redirect to avoid navigation conflicts
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch a custom event to notify AuthContext
      window.dispatchEvent(new CustomEvent('auth-logout'));
    }
    return Promise.reject(error);
  }
);

// Re-export for backward compatibility
export { formatCurrency };

// Use the apiClient instance created above
const api = apiClient;

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Menu API
export const menuAPI = {
  getMenuItems: (params = {}) => api.get('/menu', { params }),
  getMenuItem: (id) => api.get(`/menu/${id}`),
  createMenuItem: (data) => api.post('/menu', data),
  updateMenuItem: (id, data) => api.put(`/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
  getCategories: () => api.get('/menu/categories'),
};

// Orders API
export const ordersAPI = {
  getOrders: (params = {}) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrderStatus: (id, data) => api.patch(`/orders/${id}/status`, data),
  cancelOrder: (id, data) => api.patch(`/orders/${id}/cancel`, data),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSalesReport: (params = {}) => api.get('/analytics/sales', { params }),
  getPopularDishes: (params = {}) => api.get('/analytics/popular-dishes', { params }),
  getCategoryRevenue: (params = {}) => api.get('/analytics/category-revenue', { params }),
  getPeakHours: (params = {}) => api.get('/analytics/peak-hours', { params }),
};

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
  resetSettings: () => api.post('/settings/reset'),
};

export default api;
