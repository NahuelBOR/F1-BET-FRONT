// frontend/src/pages/RankingPage.js
import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Avatar // <-- ¡NUEVA IMPORTACIÓN para mostrar la foto de perfil!
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom'; // <-- ¡NUEVA IMPORTACIÓN para hacer el nombre clickeable!

function RankingPage() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                // La ruta /api/users/ranking debe devolver el campo profilePicture del usuario.
                // Tu backend ya lo hace al usar .select('-password -email')
                const res = await axios.get(`${API_BASE_URL}/users/ranking`);
                setRanking(res.data);
            } catch (err) {
                console.error('Error fetching ranking:', err.response ? err.response.data : err.message);
                setError('No se pudo cargar el ranking. Inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchRanking();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (ranking.length === 0) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="info">
                    Aún no hay usuarios en el ranking o nadie ha sumado puntos.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Ranking Global de Predicciones
            </Typography>
            {/* TableContainer ya tiene un comportamiento de desbordamiento horizontal por defecto */}
            {/* para cuando el contenido es demasiado ancho. */}
            <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
                <Table aria-label="ranking table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Puntaje Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ranking.map((user, index) => (
                            <TableRow
                                key={user._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                {/* Celda del usuario: ahora con Avatar y Link */}
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {/* Avatar del usuario */}
                                        <Avatar
                                            // La URL de la foto de perfil ya viene de Cloudinary.
                                            src={user.profilePicture || 'https://res.cloudinary.com/dh3krohqz/image/upload/v1750893404/FPgenerica_avvayb.jpg'}
                                            alt={user.username}
                                            sx={{ width: 32, height: 32, mr: 1 }} // Tamaño y margen para el avatar
                                        />
                                        {/* Nombre de usuario como Link al perfil */}
                                        <Link
                                            to={`/profile/${user._id}`}
                                            // Remueve el subrayado por defecto de los enlaces
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <Typography variant="body1" sx={{ fontWeight: '' }}>
                                                {user.username}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="h6" color="primary">
                                        {user.totalScore}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default RankingPage;