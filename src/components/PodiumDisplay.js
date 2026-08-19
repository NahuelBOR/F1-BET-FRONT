import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const PodiumDisplay = ({ first, second, third, title = 'Predicción del Podio' }) => {
  const podiumSteps = [
    {
      place: 2,
      driver: second,
      height: 120,
      color: '#C0C0C0',
      label: '2º Puesto',
      badge: 'SILVER',
    },
    {
      place: 1,
      driver: first,
      height: 160,
      color: '#FFD700',
      label: 'GANADOR',
      badge: 'GOLD',
    },
    {
      place: 3,
      driver: third,
      height: 90,
      color: '#CD7F32',
      label: '3º Puesto',
      badge: 'BRONZE',
    },
  ];

  return (
    <Box sx={{ my: 3 }}>
      {title && (
        <Typography
          variant="h6"
          align="center"
          className="font-racing"
          sx={{ mb: 3, color: '#f8fafc' }}
        >
          {title}
        </Typography>
      )}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
        gap={{ xs: 1, sm: 2 }}
        sx={{ minHeight: 240 }}
      >
        {podiumSteps.map((step) => (
          <Box
            key={step.place}
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ width: { xs: 90, sm: 130 } }}
          >
            {/* Driver Name Label */}
            <Typography
              variant="caption"
              align="center"
              sx={{
                fontWeight: 700,
                color: step.driver ? '#ffffff' : '#64748b',
                mb: 1,
                minHeight: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
              }}
            >
              {step.driver || 'Sin seleccionar'}
            </Typography>

            {/* Podium Pillar */}
            <Paper
              elevation={8}
              sx={{
                width: '100%',
                height: step.height,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderTop: `4px solid ${step.color}`,
                borderLeft: '1px solid rgba(255,255,255,0.05)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: step.place === 1 ? '0 0 20px rgba(255, 215, 0, 0.25)' : 'none',
              }}
            >
              <EmojiEventsIcon sx={{ color: step.color, fontSize: step.place === 1 ? 36 : 28 }} />
              <Typography
                variant="h5"
                className="font-racing"
                sx={{ fontWeight: 800, color: step.color, mt: 0.5 }}
              >
                P{step.place}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PodiumDisplay;
