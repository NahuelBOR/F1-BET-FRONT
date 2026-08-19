import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

import API_BASE_URL from '../config';
import { useAuth } from '../contexts/AuthContext';
import { F1_DRIVER_NAMES } from '../data/f1Drivers';
import PodiumDisplay from '../components/PodiumDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatRaceDate } from '../utils/formatters';

function PredictPage() {
  const { raceId } = useParams();
  const { user } = useAuth();

  const [race, setRace] = useState(null);
  const [predictedWinner, setPredictedWinner] = useState('');
  const [predictedSecond, setPredictedSecond] = useState('');
  const [predictedThird, setPredictedThird] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [initialPrediction, setInitialPrediction] = useState(null);

  useEffect(() => {
    const fetchRaceAndPrediction = async () => {
      try {
        const raceRes = await axios.get(`${API_BASE_URL}/races/${raceId}`);
        setRace(raceRes.data);

        if (user) {
          try {
            const predictionRes = await axios.get(`${API_BASE_URL}/predictions/${raceId}/my`);
            setPredictedWinner(predictionRes.data.predictedWinner || '');
            setPredictedSecond(predictionRes.data.predictedSecond || '');
            setPredictedThird(predictionRes.data.predictedThird || '');
            setInitialPrediction(predictionRes.data);
          } catch (predErr) {
            // No existing prediction found, completely fine
          }
        }
      } catch (err) {
        console.error('Error fetching race:', err);
        setError('No se pudo cargar la información de la carrera.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRaceAndPrediction();
    } else {
      setLoading(false);
      setError('Debes iniciar sesión para hacer una predicción.');
    }
  }, [raceId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    const selectedDrivers = new Set([predictedWinner, predictedSecond, predictedThird]);
    if (selectedDrivers.size !== 3 || !predictedWinner || !predictedSecond || !predictedThird) {
      setError('Por favor, selecciona 3 pilotos diferentes para el podio.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/predictions`, {
        raceId,
        predictedWinner,
        predictedSecond,
        predictedThird,
      });
      setSuccessMessage(res.data.msg || '¡Predicción guardada exitosamente!');
      setInitialPrediction(res.data.prediction);
    } catch (err) {
      console.error('Error submitting prediction:', err);
      setError(err.response?.data?.msg || 'Error al guardar la predicción.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Cargando datos de la carrera..." />;
  if (error && !race) return <ErrorAlert message={error} />;

  if (!race) {
    return <ErrorAlert message="Carrera no encontrada." />;
  }

  const isClosed = !race.isPredictionOpen;

  return (
    <Container maxWidth="md" className="fade-in" sx={{ mt: { xs: 2, md: 4 }, mb: 6 }}>
      <Button
        component={Link}
        to="/races"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, color: '#94a3b8' }}
      >
        Volver a Carreras
      </Button>

      <Paper
        className="glass-card"
        sx={{
          p: { xs: 3, sm: 5 },
          borderColor: isClosed
            ? 'rgba(239, 68, 68, 0.3) !important'
            : 'rgba(225, 6, 0, 0.3) !important',
        }}
      >
        {/* Race Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="caption" className="font-racing" color="primary" sx={{ letterSpacing: 2 }}>
            RONDA {race.round || 1} • {race.location}
          </Typography>
          <Typography
            variant="h4"
            className="font-racing"
            sx={{ fontWeight: 800, color: '#ffffff', mt: 0.5, mb: 1 }}
          >
            {race.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fecha: {formatRaceDate(race.date)}
          </Typography>
        </Box>

        {/* Closed warning or Existing prediction notice */}
        {isClosed && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Las predicciones para esta carrera ya están cerradas. Los campos son de solo lectura.
          </Alert>
        )}

        {!isClosed && initialPrediction && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Ya tienes una predicción enviada para esta carrera. Puedes editar tu podio antes del cierre.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Live Podium Preview */}
        <PodiumDisplay
          first={predictedWinner}
          second={predictedSecond}
          third={predictedThird}
          title="TU PODIO PRONOSTICADO"
        />

        {/* Prediction Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={isClosed}>
                <InputLabel id="winner-label">1º Puesto (Ganador)</InputLabel>
                <Select
                  labelId="winner-label"
                  value={predictedWinner}
                  label="1º Puesto (Ganador)"
                  onChange={(e) => setPredictedWinner(e.target.value)}
                >
                  {F1_DRIVER_NAMES.map((driver) => (
                    <MenuItem key={driver} value={driver}>
                      {driver}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={isClosed}>
                <InputLabel id="second-label">2º Puesto</InputLabel>
                <Select
                  labelId="second-label"
                  value={predictedSecond}
                  label="2º Puesto"
                  onChange={(e) => setPredictedSecond(e.target.value)}
                >
                  {F1_DRIVER_NAMES.map((driver) => (
                    <MenuItem key={driver} value={driver}>
                      {driver}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={isClosed}>
                <InputLabel id="third-label">3º Puesto</InputLabel>
                <Select
                  labelId="third-label"
                  value={predictedThird}
                  label="3º Puesto"
                  onChange={(e) => setPredictedThird(e.target.value)}
                >
                  {F1_DRIVER_NAMES.map((driver) => (
                    <MenuItem key={driver} value={driver}>
                      {driver}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {!isClosed && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              className="font-racing"
              disabled={submitting}
              sx={{ mt: 4, py: 1.5 }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'GUARDAR PREDICCIÓN'}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PredictPage;