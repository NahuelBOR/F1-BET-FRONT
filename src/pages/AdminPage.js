// frontend/src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, CircularProgress, Alert,
    Card, CardContent, Button, FormControl, InputLabel, Select, MenuItem, TextField, Grid, Divider
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Lista de pilotos para los Selects, igual que en PredictPage
const F1_DRIVERS_2024 = [
    "Max Verstappen", "Yuki Tsunoda", "Charles Leclerc", "Lewis Hamilton",
    "Andrea Kimi Antonelli", "George Russell", "Lando Norris", "Oscar Piastri",
    "Fernando Alonso", "Lance Stroll", "Pierre Gasly", "Franco Colapinto",
    " Isack Hadjar", "Liam Lawson", "Nico Hülkenberg", "Gabriel Bortoleto",
    "Esteban Ocon", "Oliver Bearman", "Alexander Albon", "Carlos Sainz"
];

function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [races, setRaces] = useState([]);
    const [selectedRaceId, setSelectedRaceId] = useState('');
    const [officialWinner, setOfficialWinner] = useState('');
    const [officialSecond, setOfficialSecond] = useState('');
    const [officialThird, setOfficialThird] = useState('');

    const [loadingRaces, setLoadingRaces] = useState(true);
    const [submittingResults, setSubmittingResults] = useState(false);
    const [calculatingScores, setCalculatingScores] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        // Redirigir si no es admin o si el estado de auth aún no ha cargado
        if (!authLoading && (!user || !user.isAdmin)) {
            navigate('/'); // Redirigir a inicio si no es admin
            return;
        }

        const fetchRaces = async () => {
            if (!user || !user.isAdmin) return; // No cargar si no es admin

            try {
                const res = await axios.get(`${API_BASE_URL}/races`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setRaces(res.data);
            } catch (err) {
                console.error('Error fetching races for admin:', err.response ? err.response.data : err.message);
                setError('No se pudieron cargar las carreras.');
            } finally {
                setLoadingRaces(false);
            }
        };

        if (!authLoading && user && user.isAdmin) {
            fetchRaces();
        }
    }, [user, authLoading, navigate]); // Depende del usuario, si la autenticación ha cargado, y navigate

    const handleRaceResultsSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setSubmittingResults(true);

        if (!selectedRaceId || !officialWinner || !officialSecond || !officialThird) {
            setError('Por favor, selecciona una carrera y los 3 pilotos.');
            setSubmittingResults(false);
            return;
        }

        // Validación extra: los pilotos deben ser diferentes
        const selectedDrivers = new Set([officialWinner, officialSecond, officialThird]);
        if (selectedDrivers.size !== 3) {
            setError('Los 3 pilotos para el resultado oficial deben ser diferentes.');
            setSubmittingResults(false);
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/race-results`, {
                raceId: selectedRaceId,
                officialWinner,
                officialSecond,
                officialThird
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setSuccessMessage(res.data.msg || 'Resultados de carrera registrados exitosamente.');
            // Opcional: limpiar el formulario o redirigir
            // setSelectedRaceId('');
            // setOfficialWinner('');
            // setOfficialSecond('');
            // setOfficialThird('');
        } catch (err) {
            console.error('Error submitting race results:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Error al registrar los resultados.');
        } finally {
            setSubmittingResults(false);
        }
    };

    const handleCalculateScores = async () => {
        setError(null);
        setSuccessMessage(null);
        setCalculatingScores(true);

        if (!selectedRaceId) {
            setError('Por favor, selecciona una carrera para calcular los puntos.');
            setCalculatingScores(false);
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/race-results/${selectedRaceId}/calculate-scores`, {}, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setSuccessMessage(res.data.msg || 'Puntos calculados y asignados exitosamente.');
            // Opcional: actualizar el estado de la carrera en la lista local si es necesario
        } catch (err) {
            console.error('Error calculating scores:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.msg || 'Error al calcular los puntos. Asegúrate de que los resultados estén registrados y la carrera no haya sido procesada.');
        } finally {
            setCalculatingScores(false);
        }
    };

    if (authLoading || loadingRaces) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    // Si no es admin y ya se cargó la autenticación
    if (!user || !user.isAdmin) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">Acceso denegado. No tienes permisos de administrador.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Panel de Administración
            </Typography>
            <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
                Gestiona los resultados de las carreras y calcula los puntos.
            </Typography>

            <Card sx={{ mt: 4, p: 3 }}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        1. Registrar Resultados Oficiales
                    </Typography>
                    <Box component="form" onSubmit={handleRaceResultsSubmit} noValidate sx={{ mt: 2 }}>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="race-select-label">Seleccionar Carrera</InputLabel>
                            <Select
                                labelId="race-select-label"
                                id="race-select"
                                value={selectedRaceId}
                                label="Seleccionar Carrera"
                                onChange={(e) => setSelectedRaceId(e.target.value)}
                            >
                                {races.length === 0 ? (
                                    <MenuItem value="" disabled>No hay carreras disponibles</MenuItem>
                                ) : (
                                    races.map((race) => (
                                        <MenuItem key={race._id} value={race._id}>
                                            {race.name} - {new Date(race.date).toLocaleDateString()}
                                            {race.isRaceCompleted ? ' (Puntos Calculados)' : ''}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="official-winner-label">Ganador Oficial (1º)</InputLabel>
                            <Select
                                labelId="official-winner-label"
                                id="officialWinner"
                                value={officialWinner}
                                label="Ganador Oficial (1º)"
                                onChange={(e) => setOfficialWinner(e.target.value)}
                            >
                                {F1_DRIVERS_2024.map((driver) => (
                                    <MenuItem key={driver} value={driver}>
                                        {driver}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="official-second-label">Segundo Oficial (2º)</InputLabel>
                            <Select
                                labelId="official-second-label"
                                id="officialSecond"
                                value={officialSecond}
                                label="Segundo Oficial (2º)"
                                onChange={(e) => setOfficialSecond(e.target.value)}
                            >
                                {F1_DRIVERS_2024.map((driver) => (
                                    <MenuItem key={driver} value={driver}>
                                        {driver}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="official-third-label">Tercero Oficial (3º)</InputLabel>
                            <Select
                                labelId="official-third-label"
                                id="officialThird"
                                value={officialThird}
                                label="Tercero Oficial (3º)"
                                onChange={(e) => setOfficialThird(e.target.value)}
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
                            disabled={submittingResults}
                        >
                            {submittingResults ? <CircularProgress size={24} /> : 'Registrar Resultados'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mt: 4, p: 3 }}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        2. Calcular Puntos de la Carrera
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Este paso sumará los puntos a los usuarios basándose en los resultados registrados.
                        Solo debe ejecutarse una vez por carrera.
                    </Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={handleCalculateScores}
                        disabled={calculatingScores || !selectedRaceId}
                    >
                        {calculatingScores ? <CircularProgress size={24} /> : 'Calcular Puntos para Carrera Seleccionada'}
                    </Button>
                </CardContent>
            </Card>

            {successMessage && (
                <Alert severity="success" sx={{ mt: 3 }}>
                    {successMessage}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                </Alert>
            )}
        </Container>
    );
}

export default AdminPage;