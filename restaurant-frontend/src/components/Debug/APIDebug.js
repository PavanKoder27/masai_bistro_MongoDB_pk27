import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { menuAPI, analyticsAPI, authAPI } from '../../services/api';

const APIDebug = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [token, setToken] = useState(null);

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result, error: null }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [testName]: { 
          success: false, 
          data: null, 
          error: {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          }
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testMenuAPI = async () => {
    console.log('🔍 Testing Menu API...');
    const response = await menuAPI.getMenuItems();
    console.log('📋 Menu API Response:', response);
    return {
      itemCount: response.data.data.length,
      pagination: response.data.pagination,
      sampleItems: response.data.data.slice(0, 3).map(item => ({
        name: item.name,
        price: item.price,
        category: item.category,
        hasImage: !!item.image
      }))
    };
  };

  const testCategoriesAPI = async () => {
    console.log('🔍 Testing Categories API...');
    const response = await menuAPI.getCategories();
    console.log('📋 Categories API Response:', response);
    return {
      categories: response.data.data,
      count: response.data.data.length
    };
  };

  const testAuthAPI = async () => {
    console.log('🔍 Testing Auth API...');
    const response = await authAPI.login({
      email: 'admin@masaibistro.com',
      password: 'Admin123!'
    });
    console.log('📋 Auth API Response:', response);
    setToken(response.data.data.token);
    return {
      user: response.data.data.user,
      message: response.data.message,
      tokenLength: response.data.data.token.length
    };
  };

  const testAnalyticsAPI = async () => {
    if (!token) {
      throw new Error('Authentication required - run Auth test first');
    }
    console.log('🔍 Testing Analytics API...');
    const response = await analyticsAPI.getDashboard();
    console.log('📋 Analytics API Response:', response);
    return {
      dashboardData: response.data.data,
      note: response.data.note
    };
  };

  const testDirectFetch = async () => {
    console.log('🔍 Testing Direct Fetch...');
    const response = await fetch('http://localhost:3000/api/menu');
    const data = await response.json();
    console.log('📋 Direct Fetch Response:', data);
    return {
      status: response.status,
      itemCount: data.data.length,
      success: data.success
    };
  };

  const runAllTests = async () => {
    console.log('🚀 Running all API tests...');
    await runTest('menu', testMenuAPI);
    await runTest('categories', testCategoriesAPI);
    await runTest('auth', testAuthAPI);
    await runTest('directFetch', testDirectFetch);
    // Wait a bit for auth to complete
    setTimeout(() => {
      runTest('analytics', testAnalyticsAPI);
    }, 1000);
  };

  useEffect(() => {
    console.log('🔧 API Debug component mounted');
    console.log('🌐 Current URL:', window.location.href);
    console.log('📡 API Base URL: http://localhost:3000/api');
  }, []);

  const renderResult = (testName, result) => {
    if (!result) return null;

    return (
      <Accordion key={testName}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">{testName.toUpperCase()} API</Typography>
            <Chip 
              label={result.success ? 'SUCCESS' : 'FAILED'} 
              color={result.success ? 'success' : 'error'}
              size="small"
            />
            {loading[testName] && <CircularProgress size={20} />}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {result.success ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Test passed successfully!
              </Alert>
              <Typography variant="subtitle2" gutterBottom>Response Data:</Typography>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </Paper>
            </Box>
          ) : (
            <Box>
              <Alert severity="error" sx={{ mb: 2 }}>
                Test failed: {result.error.message}
              </Alert>
              {result.error.status && (
                <Typography variant="body2" color="error" gutterBottom>
                  Status: {result.error.status} {result.error.statusText}
                </Typography>
              )}
              <Typography variant="subtitle2" gutterBottom>Error Details:</Typography>
              <Paper sx={{ p: 2, bgcolor: '#ffebee' }}>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              </Paper>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary">
        🔧 API Debug Console
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        This debug component tests all API endpoints to identify connectivity issues.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={runAllTests}
          disabled={Object.values(loading).some(l => l)}
          sx={{ mr: 2 }}
        >
          Run All Tests
        </Button>
        <Button variant="outlined" onClick={() => runTest('menu', testMenuAPI)}>
          Test Menu API
        </Button>
        <Button variant="outlined" onClick={() => runTest('auth', testAuthAPI)} sx={{ ml: 1 }}>
          Test Auth API
        </Button>
        <Button variant="outlined" onClick={() => runTest('analytics', testAnalyticsAPI)} sx={{ ml: 1 }}>
          Test Analytics API
        </Button>
      </Box>

      <Box>
        {Object.entries(results).map(([testName, result]) => 
          renderResult(testName, result)
        )}
      </Box>

      {Object.keys(results).length === 0 && (
        <Alert severity="info">
          Click "Run All Tests" to start debugging API connectivity issues.
        </Alert>
      )}
    </Box>
  );
};

export default APIDebug;
