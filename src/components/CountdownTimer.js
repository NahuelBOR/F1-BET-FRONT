import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { getTimeRemaining } from '../utils/formatters';

const CountdownTimer = ({ targetDate, raceName }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setTimeLeft(remaining);
      if (remaining.isPast) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <Paper
        className="glass-card"
        sx={{ p: 3, textAlign: 'center', borderColor: 'rgba(225, 6, 0, 0.4)' }}
      >
        <Typography variant="h6" color="primary" className="font-racing">
          🏁 {raceName || 'Gran Premio'} en curso o finalizado
        </Typography>
      </Paper>
    );
  }

  const timeBlocks = [
    { label: 'DÍAS', value: timeLeft.days },
    { label: 'HORAS', value: timeLeft.hours },
    { label: 'MINUTOS', value: timeLeft.minutes },
    { label: 'SEGUNDOS', value: timeLeft.seconds },
  ];

  return (
    <Paper className="glass-card" sx={{ p: 3, textAlign: 'center' }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        className="font-racing"
        sx={{ mb: 2, letterSpacing: 1.5, color: '#94a3b8' }}
      >
        TIEMPO HASTA LA PRÓXIMA CARRERA {raceName ? `• ${raceName.toUpperCase()}` : ''}
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        {timeBlocks.map((block, i) => (
          <Box
            key={i}
            sx={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(225, 6, 0, 0.3)',
              borderRadius: 2,
              px: 2.5,
              py: 1.5,
              minWidth: 80,
            }}
          >
            <Typography
              variant="h4"
              className="font-racing"
              sx={{ fontWeight: 800, color: '#ffffff' }}
            >
              {String(block.value).padStart(2, '0')}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.7rem' }}
            >
              {block.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default CountdownTimer;
