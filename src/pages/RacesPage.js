import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { Link } from 'react-router-dom';
import FlagIcon from '@mui/icons-material/Flag';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';

import API_BASE_URL from '../config';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatRaceDate } from '../utils/formatters';

function RacesPage() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTab, setFilterTab] = useState(0); // 0: Todas, 1: Abiertas, 2: Finalizadas

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/races`);
        setRaces(res.data);
      } catch (err) {
        console.error('Error fetching races:', err);
        setError('No se pudieron cargar las carreras. Asegúrate de que el servidor esté activo.');
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, []);

  if (loading) return <LoadingSpinner message="Cargando calendario de Grandes Premios..." />;
  if (error) return <ErrorAlert message={error} />;

  const filteredRaces = races.filter((race) => {
    if (filterTab === 1) return race.isPredictionOpen;
    if (filterTab === 2) return race.isRaceCompleted;
    return true;
  });

  return (
    <Container maxWidth="lg" className="fade-in" sx={{ mt: { xs: 2, md: 4 }, mb: 6 }}>
      {/* Header */}
      <Paper className="glass-card" sx={{ p: 4, mb: 4, textAlign: 'center' }}>
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
          CALENDARIO DE GRANDES PREMIOS
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto', mb: 3 }}>
          Pronostica el podio de cada circuito antes del cierre de predicciones y suma puntos para el campeonato.
        </Typography>

        {/* Tabs Filter */}
        <Box display="flex" justifyContent="center">
          <Tabs
            value={filterTab}
            onChange={(e, val) => setFilterTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                fontFamily: "'Orbitron', sans-serif",
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                fontWeight: 700,
                color: '#94a3b8',
                '&.Mui-selected': { color: 'primary.main' },
              },
            }}
          >
            <Tab label={`TODAS (${races.length})`} />
            <Tab label={`PREDICCIONES ABIERTAS (${races.filter((r) => r.isPredictionOpen).length})`} />
            <Tab label={`FINALIZADAS (${races.filter((r) => r.isRaceCompleted).length})`} />
          </Tabs>
        </Box>
      </Paper>

      {/* Races Grid */}
      {filteredRaces.length === 0 ? (
        <Paper className="glass-card" sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No hay carreras registradas en esta categoría.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredRaces.map((race) => (
            <Grid item xs={12} sm={6} md={4} key={race._id}>
              <Card
                className="glass-card"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: race.isPredictionOpen
                    ? '1px solid rgba(34, 197, 94, 0.4) !important'
                    : '1px solid rgba(255, 255, 255, 0.08) !important',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: race.isPredictionOpen
                      ? '0 8px 24px rgba(34, 197, 94, 0.2)'
                      : '0 8px 24px rgba(0, 0, 0, 0.4)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Status Badges */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Chip
                      label={`RONDA ${race.round || 1}`}
                      size="small"
                      className="font-racing"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                    {race.isPredictionOpen ? (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '1rem !important' }} />}
                        label="Abierta"
                        color="success"
                        size="small"
                        className="font-racing"
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    ) : (
                      <Chip
                        icon={<LockIcon sx={{ fontSize: '1rem !important' }} />}
                        label="Cerrada"
                        color="error"
                        size="small"
                        className="font-racing"
                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>

                  {/* Race Name */}
                  <Typography
                    variant="h6"
                    className="font-racing"
                    gutterBottom
                    sx={{ color: '#ffffff', fontWeight: 700, lineHeight: 1.3 }}
                  >
                    {race.name}
                  </Typography>

                  {/* Circuit / Location */}
                  <Box display="flex" alignItems="center" gap={1} mb={1.5} color="#94a3b8">
                    <LocationOnIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {race.location}
                    </Typography>
                  </Box>

                  {/* Race Date */}
                  <Box display="flex" alignItems="center" gap={1} color="#94a3b8">
                    <CalendarMonthIcon sx={{ fontSize: 18, color: '#38bdf8' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatRaceDate(race.date)}
                    </Typography>
                  </Box>
                </CardContent>

                {/* Action Button */}
                <Box sx={{ p: 3, pt: 0 }}>
                  {race.isPredictionOpen ? (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      component={Link}
                      to={`/predict/${race._id}`}
                      startIcon={<FlagIcon />}
                      className="font-racing"
                    >
                      Hacer Predicción
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      fullWidth
                      component={Link}
                      to={`/predict/${race._id}`}
                      className="font-racing"
                      sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#94a3b8' }}
                    >
                      Ver Mi Predicción
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default RacesPage;