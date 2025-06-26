// frontend/src/pages/HomePage.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function HomePage() {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Bienvenido a la Copa Piston
                </Typography>
                <Typography variant="body1">
                    ¡Demuestra tus conocimientos de Fórmula 1 y predice los resultados de cada carrera!
                    Acumula puntos y compite en el ranking.
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Cómo funciona:</Typography>
                    <ul>
                        <li>Regístrate o inicia sesión.</li>
                        <li>Navega a la sección de Carreras.</li>
                        <li>Haz tus predicciones para el top 3 de cada Gran Premio antes de la qualy.</li>
                        <li>Después de la carrera, tus puntos se calcularán automáticamente.</li>
                        <li>Consulta el ranking para ver tu posición.</li>
                    </ul>
                </Box>
            </Box>
        </Container>
    );
}

export default HomePage;