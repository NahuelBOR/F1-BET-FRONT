import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import FlagIcon from '@mui/icons-material/Flag';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';

import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Inicio', path: '/', icon: <HomeIcon /> },
    { label: 'Carreras', path: '/races', icon: <FlagIcon /> },
    { label: 'Ranking', path: '/ranking', icon: <EmojiEventsIcon /> },
  ];

  const userId = user ? (user._id || user.id) : null;

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'rgba(11, 14, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '6px',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(225, 6, 0, 0.6)',
              }}
            >
              <Typography className="font-racing" sx={{ fontWeight: 900, color: '#fff', fontSize: '1rem' }}>
                F1
              </Typography>
            </Box>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              className="font-racing"
              sx={{
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: 800,
                letterSpacing: 1.5,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
              }}
            >
              BET<Typography component="span" color="primary" className="font-racing" sx={{ fontWeight: 900 }}>.</Typography>
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                color="inherit"
                startIcon={link.icon}
                sx={{
                  color: isActive(link.path) ? 'primary.main' : '#94a3b8',
                  fontWeight: isActive(link.path) ? 700 : 500,
                  borderBottom: isActive(link.path) ? '2px solid' : '2px solid transparent',
                  borderRadius: 0,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    color: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}

            {user ? (
              <>
                {user.isAdmin && (
                  <Button
                    component={Link}
                    to="/admin"
                    color="warning"
                    variant="outlined"
                    startIcon={<AdminPanelSettingsIcon />}
                    sx={{
                      mx: 1,
                      borderColor: 'rgba(234, 179, 8, 0.4)',
                      '&:hover': { borderColor: '#eab308' },
                    }}
                  >
                    Admin
                  </Button>
                )}

                <Button
                  component={Link}
                  to={`/profile/${userId}`}
                  color="inherit"
                  startIcon={
                    user.profilePicture ? (
                      <Avatar src={user.profilePicture} sx={{ width: 26, height: 26 }} />
                    ) : (
                      <AccountCircleIcon />
                    )
                  }
                  sx={{
                    color: isActive(`/profile/${userId}`) ? 'primary.main' : '#f8fafc',
                    fontWeight: 600,
                  }}
                >
                  {user.username}
                </Button>

                <IconButton
                  onClick={logout}
                  color="error"
                  title="Cerrar Sesión"
                  sx={{ ml: 1, color: '#ef4444' }}
                >
                  <LogoutIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  startIcon={<LoginIcon />}
                  sx={{ color: '#94a3b8' }}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  sx={{ ml: 1 }}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 260,
            backgroundColor: '#0b0e14',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          },
        }}
      >
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', py: 3, px: 2 }}>
          <Typography variant="h6" className="font-racing" color="primary" sx={{ mb: 1 }}>
            F1 BET
          </Typography>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />

          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  color: isActive(link.path) ? 'primary.main' : '#f8fafc',
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: isActive(link.path) ? 'rgba(225,6,0,0.1)' : 'transparent',
                }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}

            {user ? (
              <>
                {user.isAdmin && (
                  <ListItem
                    component={Link}
                    to="/admin"
                    sx={{ color: '#eab308', borderRadius: 2, mb: 1 }}
                  >
                    <ListItemText primary="Panel de Administración" />
                  </ListItem>
                )}
                <ListItem
                  component={Link}
                  to={`/profile/${userId}`}
                  sx={{ color: '#f8fafc', borderRadius: 2, mb: 1 }}
                >
                  <ListItemText primary={`Perfil (${user.username})`} />
                </ListItem>
                <ListItem onClick={logout} sx={{ color: '#ef4444', borderRadius: 2 }}>
                  <ListItemText primary="Cerrar Sesión" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem component={Link} to="/login" sx={{ color: '#f8fafc', borderRadius: 2, mb: 1 }}>
                  <ListItemText primary="Iniciar Sesión" />
                </ListItem>
                <ListItem component={Link} to="/register" sx={{ color: 'primary.main', borderRadius: 2 }}>
                  <ListItemText primary="Registrarse" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;