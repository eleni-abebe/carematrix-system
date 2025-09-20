import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
    handleClose();
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Hospital Booking System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" component={RouterLink} to="/doctors">
              Doctors
            </Button>
            
            {isAuthenticated && user?.role === 'patient' && (
              <Button color="inherit" component={RouterLink} to="/appointments/book">
                Book Appointment
              </Button>
            )}
            
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ ml: 2 }}
                >
                  <Avatar 
                    alt={user?.name || 'User'} 
                    src={user?.avatar} 
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem 
                    component={RouterLink} 
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'}
                    onClick={handleClose}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button 
                  color="secondary" 
                  variant="contained" 
                  component={RouterLink} 
                  to="/register"
                  sx={{ ml: 1 }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ p: 3, bgcolor: 'background.paper', mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Hospital Booking System. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
