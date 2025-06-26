// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Crearemos este componente
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RacesPage from './pages/RacesPage';
import PredictPage from './pages/PredictPage';
import RankingPage from './pages/RankingPage';
import UserProfilePage from './pages/UserProfilePage';
import { CircularProgress, Box } from '@mui/material'; // Para un indicador de carga
import AdminPage from './pages/AdminPage';
import CssBaseline from '@mui/material/CssBaseline';
import F1_TEAMS from './data/f1Teams';
import React, { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // ¡Añade createTheme aquí!
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Componente de Ruta Protegida
const PrivateRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    // Si no hay usuario logueado, redirigir a login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene, redirigir a inicio
    if (requiredRole === 'admin' && !user.isAdmin) {
        return <Navigate to="/" replace />; // O a una página de "Acceso Denegado"
    }

    return children;
};

function AppContent() { // Crea un componente wrapper para usar useAuth
    const { user, loading: authLoading } = useAuth();

    // Determina el color del tema basado en la preferencia del usuario
    const currentTheme = useMemo(() => {
        let primaryColor = '#E10600'; // Default F1 Red
        if (user && user.preferredTeamTheme) {
            const selectedTeam = F1_TEAMS.find(team => team.id === user.preferredTeamTheme);
            if (selectedTeam) {
                primaryColor = selectedTeam.primaryColor;
            }
        }
        return createTheme({
            palette: {
                primary: {
                    main: primaryColor,
                },
                // Puedes añadir otros colores aquí si es necesario
            },
        });
    }, [user]); // El tema se recalcula cuando el objeto 'user' cambia

    if (authLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ThemeProvider theme={currentTheme}> {/* Aplica el tema dinámico */}
            <CssBaseline />
            <Router>
                <Navbar />
                <Box component="main" sx={{ p: 3 }}>
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
                    </Routes>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

function App() {
    return (
        <AuthProvider> {/* AuthProvider ahora envuelve AppContent */}
            <AppContent />
        </AuthProvider>
    );
}
export default App;