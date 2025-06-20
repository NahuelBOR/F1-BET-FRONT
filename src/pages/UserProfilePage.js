// frontend/src/pages/UserProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Typography, Box, CircularProgress, Alert,
    Card, CardContent, Divider, Grid, List, ListItem, ListItemText
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useAuth } from '../contexts/AuthContext'; // Para ver si es el propio usuario logueado

function UserProfilePage() {
    const { id } = useParams(); // ID del usuario cuyo perfil se está viendo
    const { user: currentUser, token } = useAuth(); // Usuario logueado y su token
    

    const [profileUser, setProfileUser] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) { // Si no hay token, no podemos hacer peticiones protegidas
                setError('Debes iniciar sesión para ver perfiles de usuario.');
                setLoading(false);
                return;
            }

            try {
                // Obtener datos del usuario del perfil
                const userRes = await axios.get(`${API_BASE_URL}/users/${id}`);
                setProfileUser(userRes.data);

                // **CAMBIO AQUÍ**: Usar el nuevo endpoint para obtener predicciones del usuario con 'id'
                const predictionsRes = await axios.get(`${API_BASE_URL}/predictions/user/${id}`, {
                    headers: { 'x-auth-token': token } // Asegurar que el token se envíe
                });
                setPredictions(predictionsRes.data);

            } catch (err) {
                console.error('Error fetching user profile or predictions:', err.response ? err.response.data : err.message);
                // Manejo de errores más específico si es 403 (Forbidden)
                if (err.response && err.response.status === 403) {
                    setError('No tienes permiso para ver las predicciones de este usuario.');
                } else if (err.response && err.response.status === 404) {
                    setError('Usuario o predicciones no encontradas.');
                }
                else {
                    setError('No se pudo cargar el perfil del usuario o sus predicciones. Asegúrate de estar logueado.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [id, token]); // Depende del ID del perfil en la URL y del token

    // Función para formatear la fecha de la carrera
    const formatRaceDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!profileUser) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="warning">Usuario no encontrado.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Perfil de {profileUser.username}
                        {currentUser && currentUser._id === id && ( // Si es el usuario logueado, mostrar "Mi Perfil"
                            <Typography variant="h6" color="text.secondary">(Mi Perfil)</Typography>
                        )}
                        {profileUser.isAdmin && ( // Si el usuario es admin, mostrar una etiqueta
                            <Typography variant="caption" color="primary" sx={{ ml: 1, fontWeight: 'bold' }}>
                                (Admin)
                            </Typography>
                        )}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Información General</Typography>
                            <Typography>
                                **Email:** {profileUser.email}
                            </Typography>
                            <Typography>
                                **Miembro desde:** {new Date(profileUser.createdAt).toLocaleDateString('es-ES')}
                            </Typography>
                            <Typography variant="h5" sx={{ mt: 2 }}>
                                **Puntaje Total:** {profileUser.totalScore} puntos
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Historial de Predicciones</Typography>
                            {predictions.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    Este usuario aún no ha realizado predicciones o no tiene historial disponible.
                                </Typography>
                            ) : (
                                <List dense>
                                    {predictions.map((pred) => (
                                        <ListItem key={pred._id} divider>
                                            <ListItemText
                                                primary={`Predicción para ${pred.race.name} (${formatRaceDate(pred.race.date)})`}
                                                secondary={
                                                    <Box component="span" sx={{ display: 'block' }}>
                                                        1º: {pred.predictedWinner}
                                                        <br />
                                                        2º: {pred.predictedSecond}
                                                        <br />
                                                        3º: {pred.predictedThird}
                                                        <br />
                                                        **Puntos obtenidos:** {pred.score}
                                                        <br />
                                                        Estado Carrera: {pred.race.isRaceCompleted ? 'Finalizada' : 'Pendiente'}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}

export default UserProfilePage;