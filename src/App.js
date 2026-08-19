import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RacesPage from './pages/RacesPage';
import PredictPage from './pages/PredictPage';
import RankingPage from './pages/RankingPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import F1_TEAMS from './data/f1Teams';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Verificando sesión..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  const { user, loading: authLoading } = useAuth();

  const currentTheme = useMemo(() => {
    let primaryColor = '#E10600'; // Default F1 Red
    if (user && user.preferredTeamTheme) {
      const selectedTeam = F1_TEAMS.find((team) => team.id === user.preferredTeamTheme);
      if (selectedTeam) {
        primaryColor = selectedTeam.primaryColor;
      }
    }

    return createTheme({
      palette: {
        mode: 'dark',
        background: {
          default: '#0B0E14',
          paper: 'rgba(21, 25, 34, 0.85)',
        },
        primary: {
          main: primaryColor,
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#38bdf8',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
        },
        success: {
          main: '#22c55e',
        },
        warning: {
          main: '#eab308',
        },
        error: {
          main: '#ef4444',
        },
      },
      typography: {
        fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
        h1: { fontFamily: "'Orbitron', sans-serif", fontWeight: 800 },
        h2: { fontFamily: "'Orbitron', sans-serif", fontWeight: 700 },
        h3: { fontFamily: "'Orbitron', sans-serif", fontWeight: 700 },
        h4: { fontFamily: "'Orbitron', sans-serif", fontWeight: 700 },
        h5: { fontFamily: "'Orbitron', sans-serif", fontWeight: 600 },
        h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: '#0B0E14',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: 'rgba(21, 25, 34, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '10px',
              padding: '8px 20px',
              transition: 'all 0.25s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
              },
            },
            containedPrimary: {
              background: `linear-gradient(135deg, ${primaryColor} 0%, rgba(225,6,0,0.8) 100%)`,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 10,
              },
            },
          },
        },
      },
    });
  }, [user]);

  if (authLoading) {
    return <LoadingSpinner message="Iniciando Paddock F1 BET..." />;
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 } }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/races" element={<RacesPage />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route path="/profile/:id" element={<UserProfilePage />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/predict/:raceId"
                element={
                  <PrivateRoute>
                    <PredictPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;