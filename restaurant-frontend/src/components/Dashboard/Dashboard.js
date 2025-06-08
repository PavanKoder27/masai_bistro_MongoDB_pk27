import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  Restaurant,
  ShoppingCart,
  AttachMoney,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { analyticsAPI, formatCurrency } from '../../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching dashboard data for timeRange:', timeRange);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 7);
      }

      const params = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        groupBy: timeRange === 'year' ? 'month' : 'day',
      };

      // Fetch all analytics data
      console.log('📡 Making analytics API calls with params:', params);
      const [
        dashboardResponse,
        salesResponse,
        popularResponse,
        categoryResponse,
        peakResponse,
      ] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getSalesReport(params),
        analyticsAPI.getPopularDishes({ limit: 5 }),
        analyticsAPI.getCategoryRevenue(params),
        analyticsAPI.getPeakHours(params),
      ]);

      console.log('✅ Analytics API responses received:', {
        dashboard: dashboardResponse.data,
        sales: salesResponse.data,
        popular: popularResponse.data,
        category: categoryResponse.data,
        peak: peakResponse.data
      });

      setDashboardData(dashboardResponse.data.data);
      setSalesData(salesResponse.data.data);
      setPopularDishes(popularResponse.data.data);
      setCategoryRevenue(categoryResponse.data.data);
      setPeakHours(peakResponse.data.data);
    } catch (err) {
      console.error('🔥 Dashboard API Error Details:', {
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
      setError(`Failed to fetch dashboard data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    console.log('🔄 Dashboard component mounted, fetching data...');
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Add a simple retry mechanism
  const retryFetch = () => {
    console.log('🔄 Retrying dashboard fetch...');
    setError(null);
    fetchDashboardData();
  };



  const formatSalesData = (data) => {
    return data.map(item => ({
      ...item,
      date: timeRange === 'year' 
        ? `${item._id.year}-${String(item._id.month).padStart(2, '0')}`
        : `${item._id.month}/${item._id.day}`,
      revenue: item.totalSales,
      orders: item.totalOrders,
    }));
  };

  const formatPeakHoursData = (data) => {
    return data.map(item => ({
      hour: `${item._id}:00`,
      orders: item.orderCount,
      revenue: item.totalRevenue,
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
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
          <Typography variant="h4" component="h1">
            Analytics Dashboard
          </Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
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

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AttachMoney color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Today's Revenue
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(dashboardData?.today?.totalRevenue)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ShoppingCart color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Today's Orders
                    </Typography>
                    <Typography variant="h5">
                      {dashboardData?.today?.totalOrders || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUp color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Avg Order Value
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(dashboardData?.today?.averageOrderValue)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Restaurant color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Active Orders
                    </Typography>
                    <Typography variant="h5">
                      {dashboardData?.activeOrders || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Sales Trend */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatSalesData(salesData)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(value) : value,
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#82ca9d" 
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Category Revenue */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalRevenue"
                    >
                      {categoryRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Popular Dishes */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Most Popular Dishes
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={popularDishes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalQuantity" fill="#8884d8" name="Quantity Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Peak Hours */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Peak Ordering Hours
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatPeakHoursData(peakHours)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
