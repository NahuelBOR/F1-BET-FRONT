// frontend/src/pages/RankingPage.js
import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';

function RankingPage() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
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

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Ranking General de Usuarios
            </Typography>
            {ranking.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Aún no hay usuarios en el ranking o nadie ha sumado puntos.
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 400 }} aria-label="ranking table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Nombre de Usuario</TableCell>
                                <TableCell align="right">Puntaje Total</TableCell>
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
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell align="right">{user.totalScore}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}

export default RankingPage;