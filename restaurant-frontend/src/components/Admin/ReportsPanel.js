import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
} from '@mui/material';
import {
  GetApp,
  Assessment,
  TrendingUp,
  PieChart,
} from '@mui/icons-material';

const ReportsPanel = () => {
  const reportTypes = [
    {
      title: 'Sales Report',
      description: 'Detailed sales analysis with trends and comparisons',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#2c3e50',
    },
    {
      title: 'Menu Performance',
      description: 'Popular items, revenue by category, and menu analytics',
      icon: <PieChart sx={{ fontSize: 40 }} />,
      color: '#27ae60',
    },
    {
      title: 'Customer Analytics',
      description: 'Customer behavior, order patterns, and demographics',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: '#e74c3c',
    },
    {
      title: 'Financial Summary',
      description: 'Revenue, expenses, profit margins, and financial KPIs',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: '#f39c12',
    },
  ];

  const handleGenerateReport = (reportType) => {
    // This would typically generate and download a report
    console.log(`Generating ${reportType} report...`);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Reports & Analytics
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Generate detailed reports and export analytics data for your restaurant operations.
      </Typography>

      <Grid container spacing={3}>
        {reportTypes.map((report, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="flex-start" mb={2}>
                  <Box sx={{ color: report.color, mr: 2 }}>
                    {report.icon}
                  </Box>
                  <Box flexGrow={1}>
                    <Typography variant="h6" gutterBottom>
                      {report.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {report.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<GetApp />}
                      onClick={() => handleGenerateReport(report.title)}
                      fullWidth
                    >
                      Generate Report
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Export Options
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Export data for external analysis or backup purposes.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GetApp />}
                onClick={() => handleGenerateReport('Menu Data')}
              >
                Export Menu Data
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GetApp />}
                onClick={() => handleGenerateReport('Order History')}
              >
                Export Orders
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GetApp />}
                onClick={() => handleGenerateReport('Customer Data')}
              >
                Export Customers
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GetApp />}
                onClick={() => handleGenerateReport('Analytics Data')}
              >
                Export Analytics
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportsPanel;
