import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Divider,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalculateIcon from '@mui/icons-material/Calculate';
import axios from 'axios';

import API_BASE_URL from '../config';
import { useAuth } from '../contexts/AuthContext';
import { F1_DRIVER_NAMES } from '../data/f1Drivers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function AdminPage() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [races, setRaces] = useState([]);
  const [loadingRaces, setLoadingRaces] = useState(true);

  // New Race Form State
  const [newRaceName, setNewRaceName] = useState('');
  const [newRaceLocation, setNewRaceLocation] = useState('');
  const [newRaceDate, setNewRaceDate] = useState('');
  const [newRaceRound, setNewRaceRound] = useState(1);
  const [creatingRace, setCreatingRace] = useState(false);

  // Results State
  const [selectedRaceId, setSelectedRaceId] = useState('');
  const [officialWinner, setOfficialWinner] = useState('');
  const [officialSecond, setOfficialSecond] = useState('');
  const [officialThird, setOfficialThird] = useState('');

  const [submittingResults, setSubmittingResults] = useState(false);
  const [calculatingScores, setCalculatingScores] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate('/');
      return;
    }

    const fetchRaces = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/races`);
        setRaces(res.data);
      } catch (err) {
        console.error('Error fetching races:', err);
        setError('No se pudieron cargar las carreras.');
      } finally {
        setLoadingRaces(false);
      }
    };

    if (!authLoading && user && user.isAdmin) {
      fetchRaces();
    }
  }, [user, authLoading, navigate]);

  const handleCreateRace = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!newRaceName || !newRaceLocation || !newRaceDate) {
      setError('Por favor completa el nombre, ubicación y fecha de la carrera.');
      return;
    }

    setCreatingRace(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/races`,
        {
          name: newRaceName,
          location: newRaceLocation,
          date: newRaceDate,
          round: Number(newRaceRound),
          season: 2024,
        },
        { headers: { 'x-auth-token': token } }
      );

      setSuccessMessage(res.data.msg || 'Carrera creada exitosamente.');
      setRaces((prev) => [...prev, res.data.race]);
      setNewRaceName('');
      setNewRaceLocation('');
      setNewRaceDate('');
    } catch (err) {
      console.error('Error creating race:', err);
      setError(err.response?.data?.msg || 'Error al crear la carrera.');
    } finally {
      setCreatingRace(false);
    }
  };

  const handleRaceResultsSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedRaceId || !officialWinner || !officialSecond || !officialThird) {
      setError('Por favor, selecciona una carrera y los 3 puestos del podio.');
      return;
    }

    const selectedDrivers = new Set([officialWinner, officialSecond, officialThird]);
    if (selectedDrivers.size !== 3) {
      setError('Los 3 puestos oficiales deben ser pilotos diferentes.');
      return;
    }

    setSubmittingResults(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/race-results`,
        {
          raceId: selectedRaceId,
          officialWinner,
          officialSecond,
          officialThird,
        },
        { headers: { 'x-auth-token': token } }
      );
      setSuccessMessage(res.data.msg || 'Resultados registrados exitosamente.');
    } catch (err) {
      console.error('Error submitting results:', err);
      setError(err.response?.data?.msg || 'Error al registrar resultados.');
    } finally {
      setSubmittingResults(false);
    }
  };

  const handleCalculateScores = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!selectedRaceId) {
      setError('Selecciona una carrera para calcular los puntos.');
      return;
    }

    setCalculatingScores(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/race-results/${selectedRaceId}/calculate-scores`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      setSuccessMessage(res.data.msg || 'Puntos calculados y asignados.');
      // Refresh races list
      const updated = await axios.get(`${API_BASE_URL}/races`);
      setRaces(updated.data);
    } catch (err) {
      console.error('Error calculating scores:', err);
      setError(err.response?.data?.msg || 'Error al calcular los puntos.');
    } finally {
      setCalculatingScores(false);
    }
  };

  if (authLoading || loadingRaces) return <LoadingSpinner message="Accediendo a la Torre de Control..." />;
  if (!user || !user.isAdmin) return <ErrorAlert message="Acceso denegado. Permisos insuficientes." />;

  return (
    <Container maxWidth="lg" className="fade-in" sx={{ mt: { xs: 2, md: 4 }, mb: 6 }}>
      {/* Header */}
      <Paper className="glass-card" sx={{ p: 4, mb: 4, textAlign: 'center', borderColor: 'rgba(234, 179, 8, 0.4) !important' }}>
        <AdminPanelSettingsIcon sx={{ fontSize: 48, color: '#eab308', mb: 1 }} />
        <Typography
          variant="h3"
          className="font-racing"
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            background: 'linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
          }}
        >
          TORRE DE CONTROL - ADMIN
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Alta de Grandes Premios, registro de podios oficiales y asignación de puntos del campeonato.
        </Typography>
      </Paper>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Section 1: Create Race */}
        <Grid item xs={12} md={6}>
          <Paper className="glass-card" sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" className="font-racing" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
              <AddCircleOutlineIcon color="primary" /> 1. CREAR NUEVO GRAN PREMIO
            </Typography>

            <Box component="form" onSubmit={handleCreateRace}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nombre de la Carrera (ej: GP de España)"
                value={newRaceName}
                onChange={(e) => setNewRaceName(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Ubicación / Circuito (ej: Montmeló, Barcelona)"
                value={newRaceLocation}
                onChange={(e) => setNewRaceLocation(e.target.value)}
              />

              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Fecha y Hora de Carrera"
                    type="datetime-local"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={newRaceDate}
                    onChange={(e) => setNewRaceDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Ronda Nº"
                    type="number"
                    value={newRaceRound}
                    onChange={(e) => setNewRaceRound(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="font-racing"
                disabled={creatingRace}
                sx={{ mt: 3, py: 1.3 }}
              >
                {creatingRace ? <CircularProgress size={24} color="inherit" /> : 'CREAR GRAN PREMIO'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Section 2: Results & Calculation */}
        <Grid item xs={12} md={6}>
          <Paper className="glass-card" sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" className="font-racing" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
              <EmojiEventsIcon sx={{ color: '#eab308' }} /> 2. RESULTADOS OFICIALES Y PUNTOS
            </Typography>

            <Box component="form" onSubmit={handleRaceResultsSubmit}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="race-select-label">Seleccionar Carrera</InputLabel>
                <Select
                  labelId="race-select-label"
                  value={selectedRaceId}
                  label="Seleccionar Carrera"
                  onChange={(e) => setSelectedRaceId(e.target.value)}
                >
                  {races.map((r) => (
                    <MenuItem key={r._id} value={r._id}>
                      {r.name} {r.isRaceCompleted ? '✅ (Procesada)' : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="w-label">1º Ganador Oficial</InputLabel>
                <Select labelId="w-label" value={officialWinner} label="1º Ganador Oficial" onChange={(e) => setOfficialWinner(e.target.value)}>
                  {F1_DRIVER_NAMES.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="s-label">2º Puesto Oficial</InputLabel>
                <Select labelId="s-label" value={officialSecond} label="2º Puesto Oficial" onChange={(e) => setOfficialSecond(e.target.value)}>
                  {F1_DRIVER_NAMES.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="t-label">3º Puesto Oficial</InputLabel>
                <Select labelId="t-label" value={officialThird} label="3º Puesto Oficial" onChange={(e) => setOfficialThird(e.target.value)}>
                  {F1_DRIVER_NAMES.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                className="font-racing"
                disabled={submittingResults}
                sx={{ mt: 2, py: 1.2 }}
              >
                {submittingResults ? <CircularProgress size={24} color="inherit" /> : 'GUARDAR RESULTADOS OFICIALES'}
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<CalculateIcon />}
              className="font-racing"
              onClick={handleCalculateScores}
              disabled={calculatingScores || !selectedRaceId}
              sx={{ py: 1.3 }}
            >
              {calculatingScores ? <CircularProgress size={24} color="inherit" /> : 'CALCULAR Y ASIGNAR PUNTOS'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminPage;