import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, Paper } from '@mui/material';

const SimpleTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testDirectFetch = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔍 Testing direct fetch to backend...');
      
      // Test 1: Direct fetch to backend
      const response = await fetch('http://localhost:3000/api/menu');
      const data = await response.json();
      
      console.log('✅ Direct fetch successful:', data);
      
      setResult({
        success: true,
        method: 'Direct Fetch',
        itemCount: data.data.length,
        firstItem: data.data[0],
        response: data
      });
      
    } catch (error) {
      console.error('❌ Direct fetch failed:', error);
      setResult({
        success: false,
        method: 'Direct Fetch',
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const testAxiosCall = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔍 Testing axios call...');
      
      // Import axios dynamically
      const axios = (await import('axios')).default;
      
      const response = await axios.get('http://localhost:3000/api/menu');
      
      console.log('✅ Axios call successful:', response.data);
      
      setResult({
        success: true,
        method: 'Axios',
        itemCount: response.data.data.length,
        firstItem: response.data.data[0],
        response: response.data
      });
      
    } catch (error) {
      console.error('❌ Axios call failed:', error);
      setResult({
        success: false,
        method: 'Axios',
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const testAPIService = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔍 Testing API service...');
      
      // Import the API service
      const { menuAPI } = await import('../../services/api');
      
      const response = await menuAPI.getMenuItems();
      
      console.log('✅ API service call successful:', response.data);
      
      setResult({
        success: true,
        method: 'API Service',
        itemCount: response.data.data.length,
        firstItem: response.data.data[0],
        response: response.data
      });
      
    } catch (error) {
      console.error('❌ API service call failed:', error);
      setResult({
        success: false,
        method: 'API Service',
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔧 Simple Test component mounted');
    console.log('🌐 Current URL:', window.location.href);
    console.log('📡 Target API: http://localhost:3000/api/menu');
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom color="primary">
        🧪 Simple Connectivity Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        This component tests the most basic API connectivity to identify the root cause.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={testDirectFetch}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Test Direct Fetch
        </Button>
        <Button 
          variant="outlined" 
          onClick={testAxiosCall}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          Test Axios
        </Button>
        <Button 
          variant="outlined" 
          onClick={testAPIService}
          disabled={loading}
        >
          Test API Service
        </Button>
      </Box>

      {loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Testing API connectivity...
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Result: {result.method}
          </Typography>
          
          {result.success ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                ✅ Test PASSED! API is working correctly.
              </Alert>
              <Typography variant="body2" gutterBottom>
                Items returned: {result.itemCount}
              </Typography>
              <Typography variant="body2" gutterBottom>
                First item: {result.firstItem?.name} (₹{result.firstItem?.price})
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Full Response:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#f5f5f5', mt: 1 }}>
                <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '300px' }}>
                  {JSON.stringify(result.response, null, 2)}
                </pre>
              </Paper>
            </Box>
          ) : (
            <Box>
              <Alert severity="error" sx={{ mb: 2 }}>
                ❌ Test FAILED! {result.error}
              </Alert>
              {result.status && (
                <Typography variant="body2" color="error" gutterBottom>
                  HTTP Status: {result.status}
                </Typography>
              )}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Error Details:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#ffebee', mt: 1 }}>
                <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '300px' }}>
                  {JSON.stringify({
                    error: result.error,
                    response: result.response,
                    status: result.status,
                    config: result.config
                  }, null, 2)}
                </pre>
              </Paper>
            </Box>
          )}
        </Paper>
      )}

      {!result && !loading && (
        <Alert severity="info">
          Click any test button to check API connectivity.
        </Alert>
      )}
    </Box>
  );
};

export default SimpleTest;
