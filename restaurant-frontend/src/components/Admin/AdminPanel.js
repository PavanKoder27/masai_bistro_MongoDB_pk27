import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Restaurant,
  People,
  Assessment,
  Settings,
} from '@mui/icons-material';
import MenuManagement from './MenuManagement';
import UserManagement from './UserManagement';
import ReportsPanel from './ReportsPanel';
import SystemSettings from './SystemSettings';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const adminSections = [
    {
      title: 'Menu Management',
      description: 'Manage menu items, categories, and pricing',
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      color: '#2c3e50',
    },
    {
      title: 'User Management',
      description: 'Manage staff accounts and permissions',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#27ae60',
    },
    {
      title: 'Reports & Analytics',
      description: 'View detailed reports and analytics',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: '#e74c3c',
    },
    {
      title: 'System Settings',
      description: 'Configure system settings and preferences',
      icon: <Settings sx={{ fontSize: 40 }} />,
      color: '#f39c12',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your restaurant's operations, staff, and settings
        </Typography>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {adminSections.map((section, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => setActiveTab(index)}
              >
                <CardContent sx={{ textAlign: 'center', pb: 1 }}>
                  <Box sx={{ color: section.color, mb: 2 }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                  <Button
                    size="small"
                    variant={activeTab === index ? 'contained' : 'outlined'}
                  >
                    {activeTab === index ? 'Active' : 'Manage'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin panel tabs">
            <Tab
              icon={<Restaurant />}
              label="Menu"
              id="admin-tab-0"
              aria-controls="admin-tabpanel-0"
            />
            <Tab
              icon={<People />}
              label="Users"
              id="admin-tab-1"
              aria-controls="admin-tabpanel-1"
            />
            <Tab
              icon={<Assessment />}
              label="Reports"
              id="admin-tab-2"
              aria-controls="admin-tabpanel-2"
            />
            <Tab
              icon={<Settings />}
              label="Settings"
              id="admin-tab-3"
              aria-controls="admin-tabpanel-3"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <MenuManagement />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <UserManagement />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <ReportsPanel />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <SystemSettings />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default AdminPanel;
