// frontend/src/pages/RacesPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Card, CardContent, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

function RacesPage() {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRaces = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/races`);
                setRaces(res.data);
            } catch (err) {
                console.error('Error fetching races:', err.response ? err.response.data : err.message);
                setError('No se pudieron cargar las carreras. Inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchRaces();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

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

    // Función para formatear la fecha y hora
    const formatRaceDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Calendario de Carreras de F1
            </Typography>
            <Grid container spacing={3}>
                {races.length === 0 ? (
                    <Grid item xs={12}>
                        <Alert severity="info" sx={{ mt: 2 }}>
                            No hay carreras disponibles en este momento.
                        </Alert>
                    </Grid>
                ) : (
                    races.map((race) => (
                        <Grid item xs={12} sm={6} md={4} key={race._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="h2">
                                        {race.name}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {race.location}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Fecha: {formatRaceDate(race.date)}
                                    </Typography>
                                    <Typography variant="body2">
                                        Temporada: {race.season}, Ronda: {race.round}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }} color={race.isPredictionOpen ? 'success.main' : 'error.main'}>
                                        Predicciones: {race.isPredictionOpen ? 'Abiertas' : 'Cerradas'}
                                    </Typography>
                                    <Typography variant="body2" color={race.isRaceCompleted ? 'primary.main' : 'warning.main'}>
                                        Carrera: {race.isRaceCompleted ? 'Finalizada' : 'Pendiente'}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    {race.isPredictionOpen ? (
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            component={Link}
                                            to={`/predict/${race._id}`}
                                            sx={{ mb: 1 }}
                                        >
                                            Hacer Predicción
                                        </Button>
                                    ) : (
                                        <Button variant="outlined" fullWidth disabled>
                                            Predicciones Cerradas
                                        </Button>
                                    )}
                                    {/* Aquí podrías añadir un botón para ver los resultados/tu predicción una vez la carrera finalice */}
                                </Box>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
}

export default RacesPage;