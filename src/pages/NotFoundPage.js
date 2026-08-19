import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import FlagIcon from '@mui/icons-material/Flag';

function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        className="glass-card fade-in"
        sx={{
          p: 5,
          textAlign: 'center',
          borderColor: 'rgba(234, 179, 8, 0.4)',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <FlagIcon sx={{ fontSize: 72, color: '#eab308' }} />
        </Box>
        <Typography variant="h2" className="font-racing" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" className="font-racing" sx={{ mb: 2, color: '#f8fafc' }}>
          ¡BANDERA AMARILLA EN PISTA!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Te has salido del trazado del circuito. La página que buscas no existe o ha sido trasladada al Paddock.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          size="large"
          className="font-racing"
          sx={{ px: 4, py: 1.2, borderRadius: 2 }}
        >
          Volver a Inicio
        </Button>
      </Paper>
    </Container>
  );
}

export default NotFoundPage;
