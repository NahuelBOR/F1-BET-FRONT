import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, Card, CardContent, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import FlagIcon from '@mui/icons-material/Flag';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SpeedIcon from '@mui/icons-material/Speed';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import axios from 'axios';

import CountdownTimer from '../components/CountdownTimer';
import API_BASE_URL from '../config';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { user } = useAuth();
  const [nextRace, setNextRace] = useState(null);

  useEffect(() => {
    const fetchNextRace = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/races`);
        if (response.data && response.data.length > 0) {
          const upcoming = response.data.find((r) => r.isPredictionOpen) || response.data[0];
          setNextRace(upcoming);
        }
      } catch (err) {
        console.log('No races loaded yet for countdown timer');
      }
    };
    fetchNextRace();
  }, []);

  const featureCards = [
    {
      title: '1. Elige tu Podio',
      desc: 'Selecciona los 3 pilotos que crees que ocuparán los puestos 1º, 2º y 3º en cada Gran Premio.',
      icon: <HowToVoteIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
      title: '2. Suma Puntos',
      desc: 'Obtén 3 puntos por acierto exacto en posición y 1 punto si el piloto entra al podio en otra posición.',
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#38bdf8' }} />,
    },
    {
      title: '3. Domina el Ranking',
      desc: 'Compite contra la comunidad y escala puestos en la clasificación general de la temporada.',
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#eab308' }} />,
    },
  ];

  return (
    <Container maxWidth="lg" className="fade-in" sx={{ mt: { xs: 2, md: 4 }, mb: 6 }}>
      {/* Hero Section */}
      <Paper
        className="glass-card"
        sx={{
          p: { xs: 3, sm: 6 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          mb: 6,
          background: 'linear-gradient(135deg, rgba(225, 6, 0, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(225, 6, 0, 0.25) !important',
        }}
      >
        <Box sx={{ mb: 2, display: 'inline-flex', p: 1, borderRadius: 3, bgcolor: 'rgba(225,6,0,0.15)' }}>
          <SpeedIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="caption" className="font-racing" color="primary" sx={{ letterSpacing: 2, fontWeight: 700 }}>
            TEMPORADA 2024 / 2025
          </Typography>
        </Box>

        <Typography
          variant="h2"
          component="h1"
          className="font-racing"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', sm: '3.2rem', md: '4rem' },
            background: 'linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 900,
          }}
        >
          PREDICCIONES FÓRMULA 1
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: 'auto', mb: 4, fontWeight: 400, fontSize: { xs: '0.95rem', sm: '1.15rem' } }}
        >
          Demuestra tu visión de carrera en cada Gran Premio. Pronostica el podio oficial, acumula puntos y consolídate como el rey del Paddock.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/races"
            startIcon={<FlagIcon />}
            className="font-racing"
            sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
          >
            Ver Carreras
          </Button>

          {!user ? (
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={Link}
              to="/register"
              className="font-racing"
              sx={{ px: 4, py: 1.5, fontSize: '1rem', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              Crear Cuenta
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              component={Link}
              to="/ranking"
              startIcon={<EmojiEventsIcon />}
              className="font-racing"
              sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
            >
              Ver Ranking Global
            </Button>
          )}
        </Box>
      </Paper>

      {/* Countdown section if race available */}
      {nextRace && (
        <Box sx={{ mb: 6 }}>
          <CountdownTimer
            targetDate={nextRace.date}
            raceName={`${nextRace.name} (${nextRace.location})`}
          />
        </Box>
      )}

      {/* Features Grid */}
      <Typography
        variant="h5"
        align="center"
        className="font-racing"
        sx={{ mb: 4, color: '#f8fafc', letterSpacing: 1 }}
      >
        ¿CÓMO FUNCIONA LA COMPETICIÓN?
      </Typography>

      <Grid container spacing={3}>
        {featureCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              className="glass-card"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
                  borderColor: 'rgba(225, 6, 0, 0.4) !important',
                },
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>{card.icon}</Box>
                <Typography variant="h6" className="font-racing" gutterBottom sx={{ color: '#ffffff' }}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {card.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HomePage;