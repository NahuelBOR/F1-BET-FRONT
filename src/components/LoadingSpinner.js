import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      gap={2}
    >
      <CircularProgress
        size={54}
        thickness={4}
        sx={{
          color: 'primary.main',
          filter: 'drop-shadow(0 0 10px rgba(225,6,0,0.5))',
        }}
      />
      <Typography variant="body1" color="text.secondary" className="font-racing">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
