import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import axios from 'axios';

import API_BASE_URL from '../config';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/ranking`);
        setRanking(res.data);
      } catch (err) {
        console.error('Error fetching ranking:', err);
        setError('No se pudo cargar el ranking global.');
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  if (loading) return <LoadingSpinner message="Calculando posiciones del Campeonato..." />;
  if (error) return <ErrorAlert message={error} />;

  const top3 = ranking.slice(0, 3);

  const getRankBadge = (index) => {
    if (index === 0) return { color: '#FFD700', label: '1º LUGAR', icon: <EmojiEventsIcon sx={{ color: '#FFD700' }} /> };
    if (index === 1) return { color: '#C0C0C0', label: '2º LUGAR', icon: <MilitaryTechIcon sx={{ color: '#C0C0C0' }} /> };
    if (index === 2) return { color: '#CD7F32', label: '3º LUGAR', icon: <MilitaryTechIcon sx={{ color: '#CD7F32' }} /> };
    return null;
  };

  return (
    <Container maxWidth="md" className="fade-in" sx={{ mt: { xs: 2, md: 4 }, mb: 6 }}>
      {/* Header */}
      <Paper className="glass-card" sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <EmojiEventsIcon sx={{ fontSize: 48, color: '#eab308', mb: 1 }} />
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
          RANKING GENERAL DE LA TEMPORADA
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Clasificación oficial basada en la acumulación de puntos por aciertos en cada Gran Premio.
        </Typography>
      </Paper>

      {/* Top 3 Cards */}
      {top3.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 4 }} justifyContent="center">
          {top3.map((player, idx) => {
            const badge = getRankBadge(idx);
            const isMe = currentUser && (currentUser._id === player._id || currentUser.id === player._id);

            return (
              <Grid item xs={12} sm={4} key={player._id}>
                <Paper
                  className="glass-card"
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderTop: `4px solid ${badge.color} !important`,
                    boxShadow: idx === 0 ? '0 0 20px rgba(255, 215, 0, 0.2)' : 'none',
                    backgroundColor: isMe ? 'rgba(225, 6, 0, 0.12)' : 'rgba(21, 25, 34, 0.85)',
                  }}
                >
                  {badge.icon}
                  <Typography variant="caption" className="font-racing" sx={{ display: 'block', color: badge.color, fontWeight: 700 }}>
                    {badge.label}
                  </Typography>

                  <Avatar
                    src={player.profilePicture || 'https://res.cloudinary.com/dh3krohqz/image/upload/v1750893404/FPgenerica_avvayb.jpg'}
                    alt={player.username}
                    sx={{
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      my: 1.5,
                      border: `2px solid ${badge.color}`,
                    }}
                  />

                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/profile/${player._id}`}
                    sx={{ textDecoration: 'none', color: '#fff', fontWeight: 700, display: 'block' }}
                  >
                    {player.username}
                  </Typography>

                  <Typography variant="h5" className="font-racing" color="primary" sx={{ fontWeight: 800, mt: 1 }}>
                    {player.totalScore || 0} <Typography component="span" variant="caption" color="text.secondary">PTS</Typography>
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Full Leaderboard Table */}
      <TableContainer component={Paper} className="glass-card">
        <Table aria-label="ranking table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }} className="font-racing">
                POS
              </TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }} className="font-racing">
                USUARIO
              </TableCell>
              <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 700 }} className="font-racing">
                PUNTOS TOTALES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.map((player, index) => {
              const isMe = currentUser && (currentUser._id === player._id || currentUser.id === player._id);

              return (
                <TableRow
                  key={player._id}
                  sx={{
                    backgroundColor: isMe ? 'rgba(225, 6, 0, 0.12)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Typography
                      variant="body2"
                      className="font-racing"
                      sx={{
                        fontWeight: 800,
                        color: index < 3 ? 'primary.main' : '#94a3b8',
                      }}
                    >
                      #{index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        src={player.profilePicture || 'https://res.cloudinary.com/dh3krohqz/image/upload/v1750893404/FPgenerica_avvayb.jpg'}
                        alt={player.username}
                        sx={{ width: 36, height: 36 }}
                      />
                      <Typography
                        component={Link}
                        to={`/profile/${player._id}`}
                        variant="body1"
                        sx={{
                          textDecoration: 'none',
                          color: isMe ? 'primary.main' : '#f8fafc',
                          fontWeight: isMe ? 700 : 500,
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {player.username} {isMe ? '(Tú)' : ''}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" className="font-racing" color="primary" sx={{ fontWeight: 800 }}>
                      {player.totalScore || 0}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default RankingPage;