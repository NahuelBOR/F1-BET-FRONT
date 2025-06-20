// frontend/src/pages/PredictPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, TextField, Button,
    CircularProgress, Alert, Card, CardContent, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Sugerencia: Una lista básica de pilotos. En un proyecto real, esto podría venir del backend.
const F1_DRIVERS_2024 = [
    "Max Verstappen", "Yuki Tsunoda", "Charles Leclerc", "Lewis Hamilton",
    "Andrea Kimi Antonelli", "George Russell", "Lando Norris", "Oscar Piastri",
    "Fernando Alonso", "Lance Stroll", "Pierre Gasly", "Franco Colapinto",
    " Isack Hadjar", "Liam Lawson", "Nico Hülkenberg", "Gabriel Bortoleto",
    "Esteban Ocon", "Oliver Bearman", "Alexander Albon", "Carlos Sainz"
];

function PredictPage() {
    const { raceId } = useParams(); // Obtiene el ID de la carrera de la URL
    const navigate = useNavigate();
    const { user } = useAuth(); // Necesitamos saber si el usuario está logueado
    
    const [race, setRace] = useState(null);
    const [predictedWinner, setPredictedWinner] = useState('');
    const [predictedSecond, setPredictedSecond] = useState('');
    const [predictedThird, setPredictedThird] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [initialPrediction, setInitialPrediction] = useState(null); // Para saber si ya hay una predicción

    useEffect(() => {
        const fetchRaceAndPrediction = async () => {
            try {
                // Obtener detalles de la carrera
                const raceRes = await axios.get(`${API_BASE_URL}/races/${raceId}`);
                setRace(raceRes.data);

                // Obtener predicción existente del usuario para esta carrera (si existe)
                // Solo si el usuario está logueado
                if (user) {
                    try {
                        const predictionRes = await axios.get(`${API_BASE_URL}/predictions/${raceId}/my`);
                        setPredictedWinner(predictionRes.data.predictedWinner);
                        setPredictedSecond(predictionRes.data.predictedSecond);
                        setPredictedThird(predictionRes.data.predictedThird);
                        setInitialPrediction(predictionRes.data); // Guarda la predicción inicial
                    } catch (predErr) {
                        // Si no hay predicción existente, no es un error crítico aquí
                        if (predErr.response && predErr.response.status === 404) {
                            console.log('No existing prediction for this race and user.');
                        } else {
                            console.error('Error fetching existing prediction:', predErr.response ? predErr.response.data : predErr.message);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching race or prediction:', err.response ? err.response.data : err.message);
                setError('No se pudo cargar la información de la carrera o tu predicción.');
            } finally {
                setLoading(false);
            }
        };

        if (user) { // Solo si el usuario está logueado, intentamos buscar la predicción
            fetchRaceAndPrediction();
        } else {
            // Si no está logueado, mostrar mensaje o redirigir
            setLoading(false);
            setError('Debes iniciar sesión para hacer una predicción.');
            // Opcional: navigate('/login');
        }

    }, [raceId, user]); // Depende de raceId y si el usuario cambia

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setSubmitting(true);

        // Validar que los 3 pilotos sean diferentes
        const selectedDrivers = new Set([predictedWinner, predictedSecond, predictedThird]);
        if (selectedDrivers.size !== 3 || predictedWinner === '' || predictedSecond === '' || predictedThird === '') {
            setError('Por favor, selecciona 3 pilotos diferentes para los tres primeros puestos.');
            setSubmitting(false);
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/predictions`, {
                raceId,
                predictedWinner,
                predictedSecond,
                predictedThird
            });
            setSuccessMessage(res.data.msg || 'Predicción guardada exitosamente.');
            setInitialPrediction(res.data.prediction); // Actualiza la predicción inicial
            // Opcional: Redirigir o limpiar formulario después de un tiempo
            // setTimeout(() => navigate('/races'), 2000);
        } catch (err) {
            console.error('Error submitting prediction:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Error al guardar la predicción. Asegúrate de que las predicciones estén abiertas.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error && !race) { // Si hay un error y la carrera no pudo cargarse
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
                <Button component={Link} to="/races" sx={{ mt: 2 }}>Volver a Carreras</Button>
            </Container>
        );
    }

    if (!race || !race.isPredictionOpen) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="warning">
                    {race ? `Las predicciones para ${race.name} ya están cerradas.` : 'Carrera no encontrada o predicciones no disponibles.'}
                </Alert>
                <Button component={Link} to="/races" sx={{ mt: 2 }}>Volver a Carreras</Button>
            </Container>
        );
    }


    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Predecir para: {race ? race.name : 'Cargando...'}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                        Fecha de la carrera: {race ? new Date(race.date).toLocaleString() : '...'}
                    </Typography>

                    {initialPrediction && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Ya tienes una predicción para esta carrera. Estás editándola.
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {successMessage}
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="winner-label">Ganador (1º Puesto)</InputLabel>
                            <Select
                                labelId="winner-label"
                                id="predictedWinner"
                                value={predictedWinner}
                                label="Ganador (1º Puesto)"
                                onChange={(e) => setPredictedWinner(e.target.value)}
                            >
                                {F1_DRIVERS_2024.map((driver) => (
                                    <MenuItem key={driver} value={driver}>
                                        {driver}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="second-label">Segundo Puesto</InputLabel>
                            <Select
                                labelId="second-label"
                                id="predictedSecond"
                                value={predictedSecond}
                                label="Segundo Puesto"
                                onChange={(e) => setPredictedSecond(e.target.value)}
                            >
                                {F1_DRIVERS_2024.map((driver) => (
                                    <MenuItem key={driver} value={driver}>
                                        {driver}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="third-label">Tercer Puesto</InputLabel>
                            <Select
                                labelId="third-label"
                                id="predictedThird"
                                value={predictedThird}
                                label="Tercer Puesto"
                                onChange={(e) => setPredictedThird(e.target.value)}
                            >
                                {F1_DRIVERS_2024.map((driver) => (
                                    <MenuItem key={driver} value={driver}>
                                        {driver}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={submitting || !user} // Deshabilitar si no hay usuario logueado
                        >
                            {submitting ? <CircularProgress size={24} /> : 'Guardar Predicción'}
                        </Button>
                        {!user && (
                            <Typography variant="body2" color="error" align="center">
                                Debes iniciar sesión para hacer una predicción.
                            </Typography>
                        )}
                        <Box sx={{ textAlign: 'center' }}>
                            <Link to="/races" style={{ textDecoration: 'none' }}>
                                Volver al listado de carreras
                            </Link>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

export default PredictPage;