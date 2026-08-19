import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ErrorAlert = ({ message, backUrl = '/races', backText = 'Volver a Carreras' }) => {
  return (
    <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
      <Alert
        severity="error"
        sx={{
          borderRadius: 3,
          backgroundColor: 'rgba(211, 47, 47, 0.15)',
          color: '#ff8a80',
          border: '1px solid rgba(211, 47, 47, 0.3)',
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>Error</AlertTitle>
        {message}
      </Alert>
      {backUrl && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="outlined" color="primary" component={Link} to={backUrl}>
            {backText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ErrorAlert;
