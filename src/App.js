// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext'; // Importa el hook para el contexto
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

function App() {
    return (
        <Router>
            <Navbar /> {/* La barra de navegación estará visible en todas las páginas */}
            <Box component="main" sx={{ p: 3 }}> {/* Contenido principal con padding de Material-UI */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/races" element={<RacesPage />} /> {/* Las carreras pueden ser públicas */}
                    <Route path="/ranking" element={<RankingPage />} /> {/* El ranking puede ser público */}
                    <Route path="/profile/:id" element={<UserProfilePage />} /> {/* Perfil público, pero detalles privados */}

                    <Route 
                        path="/admin"
                        element={
                            <PrivateRoute requiredRole="admin">
                                <AdminPage />
                            </PrivateRoute>
                        }
                    />{/* Ruta Protegida para la administración, solo para administradores */}

                    {/* Rutas Protegidas */}
                    <Route
                        path="/predict/:raceId"
                        element={
                            <PrivateRoute>
                                <PredictPage />
                            </PrivateRoute>
                        }
                    />
                    {/* Podrías añadir una ruta para editar perfil también si es necesario */}
                </Routes>
            </Box>
        </Router>
    );
}

export default App;