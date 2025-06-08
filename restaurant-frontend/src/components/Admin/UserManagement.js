import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Construction,
  Search,
  FilterList,
  Visibility,
  Edit,
  PersonAdd,
  Person,
  Email,
  Phone,
  Badge,
  CalendarToday,
  AccessTime,
  Close,
} from '@mui/icons-material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data for demonstration - in real app, this would come from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUsers = [
          {
            _id: '1',
            firstName: 'Arjun',
            lastName: 'Patel',
            email: 'admin@masaibistro.com',
            phone: '+91-98765-43210',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-15T10:30:00Z',
            lastLogin: '2024-01-20T14:22:00Z',
            avatar: null
          },
          {
            _id: '2',
            firstName: 'Priya',
            lastName: 'Sharma',
            email: 'manager@masaibistro.com',
            phone: '+91-87654-32109',
            role: 'manager',
            status: 'active',
            createdAt: '2024-01-16T09:15:00Z',
            lastLogin: '2024-01-20T13:45:00Z',
            avatar: null
          },
          {
            _id: '3',
            firstName: 'Rahul',
            lastName: 'Singh',
            email: 'staff@masaibistro.com',
            phone: '+91-76543-21098',
            role: 'staff',
            status: 'active',
            createdAt: '2024-01-17T11:20:00Z',
            lastLogin: '2024-01-19T16:30:00Z',
            avatar: null
          },
          {
            _id: '4',
            firstName: 'Anita',
            lastName: 'Kumar',
            email: 'anita.kumar@masaibistro.com',
            phone: '+91-65432-10987',
            role: 'staff',
            status: 'active',
            createdAt: '2024-01-18T08:45:00Z',
            lastLogin: '2024-01-20T12:15:00Z',
            avatar: null
          },
          {
            _id: '5',
            firstName: 'Vikram',
            lastName: 'Gupta',
            email: 'vikram.gupta@masaibistro.com',
            phone: '+91-54321-09876',
            role: 'manager',
            status: 'inactive',
            createdAt: '2024-01-10T15:30:00Z',
            lastLogin: '2024-01-18T10:20:00Z',
            avatar: null
          }
        ];

        setUsers(mockUsers);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'staff':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '👨‍💼';
      case 'manager':
        return '👩‍💼';
      case 'staff':
        return '👨‍🍳';
      default:
        return '👤';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" gutterBottom>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Add New User
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary" align="center">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getRoleIcon(user.role)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.toUpperCase()}
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status.toUpperCase()}
                        color={getStatusColor(user.status)}
                        size="small"
                        variant={user.status === 'active' ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(user.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(user.lastLogin)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(user)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleDetailDialogClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              User Details
            </Typography>
            <IconButton onClick={handleDetailDialogClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {selectedUser && (
            <Box>
              {/* User Profile */}
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
                  {getRoleIcon(selectedUser.role)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Typography>
                  <Chip
                    label={selectedUser.role.toUpperCase()}
                    color={getRoleColor(selectedUser.role)}
                    size="small"
                    sx={{ mt: 1, fontWeight: 600 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Contact Information */}
              <Typography variant="h6" gutterBottom color="primary">
                Contact Information
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body2">{selectedUser.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body2">{selectedUser.phone}</Typography>
                </Box>
              </Box>

              {/* Account Information */}
              <Typography variant="h6" gutterBottom color="primary">
                Account Information
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Badge sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip
                    label={selectedUser.status.toUpperCase()}
                    color={getStatusColor(selectedUser.status)}
                    size="small"
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">Joined:</Typography>
                  <Typography variant="body2">{formatDate(selectedUser.createdAt)}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">Last Login:</Typography>
                  <Typography variant="body2">{formatDate(selectedUser.lastLogin)}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDetailDialogClose}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Edit />}>
            Edit User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
