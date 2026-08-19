import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Grid,
  Button,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PaletteIcon from '@mui/icons-material/Palette';
import axios from 'axios';

import API_BASE_URL from '../config';
import { useAuth } from '../contexts/AuthContext';
import F1_TEAMS from '../data/f1Teams';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatRaceDate } from '../utils/formatters';

function UserProfilePage() {
  const { id } = useParams();
  const { user: currentUser, token, fetchUser, updateUserPreferences } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const [selectedTeamTheme, setSelectedTeamTheme] = useState('');
  const [savingTheme, setSavingTheme] = useState(false);
  const [themeSaveSuccess, setThemeSaveSuccess] = useState(null);
  const [themeSaveError, setThemeSaveError] = useState(null);

  const isOwnProfile = currentUser && (currentUser._id === id || currentUser.id === id);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRes = await axios.get(`${API_BASE_URL}/users/${id}`);
        setProfileUser(userRes.data);
        setSelectedTeamTheme(userRes.data.preferredTeamTheme || 'default');

        if (token) {
          try {
            const predictionsRes = await axios.get(`${API_BASE_URL}/predictions/user/${id}`, {
              headers: { 'x-auth-token': token },
            });
            setPredictions(predictionsRes.data);
          } catch (predErr) {
            console.log('No predictions found for user or forbidden');
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('No se pudo cargar el perfil del usuario.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [id, token]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadSuccess(null);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Por favor, selecciona una imagen para subir.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const res = await axios.post(`${API_BASE_URL}/upload/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });
      setUploadSuccess(res.data.msg);
      setProfileUser((prev) => ({ ...prev, profilePicture: res.data.profilePicture }));
      fetchUser();
      setSelectedFile(null);
    } catch (err) {
      console.error('Error uploading picture:', err);
      setUploadError(err.response?.data?.msg || 'Error al subir la foto de perfil.');
    } finally {
      setUploading(false);
    }
  };

  const handleTeamThemeChange = async (event) => {
    const newTeamId = event.target.value;
    setSelectedTeamTheme(newTeamId);
    setSavingTheme(true);
    setThemeSaveSuccess(null);
    setThemeSaveError(null);

    const success = await updateUserPreferences({ preferredTeamTheme: newTeamId });
    if (success) {
      setThemeSaveSuccess('Tema de equipo actualizado con éxito.');
    } else {
      setThemeSaveError('Error al actualizar el tema.');
    }
    setSavingTheme(false);
  };

  if (loading) return <LoadingSpinner message="Cargando perfil del piloto..." />;
  if (error || !profileUser) return <ErrorAlert message={error || 'Usuario no encontrado.'} />;

  const currentTeam = F1_TEAMS.find((t) => t.id === profileUser.preferredTeamTheme) || F1_TEAMS[0];

  return (
    <Container maxWidth="md" className="fade-in" sx={{ mt: { xs: 2, md: 4 }, mb: 6 }}>
      {/* Profile Header Banner */}
      <Paper
        className="glass-card"
        sx={{
          p: 4,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          borderColor: `${currentTeam.primaryColor} !important`,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Avatar & Photo Upload */}
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={profileUser.profilePicture || 'https://res.cloudinary.com/dh3krohqz/image/upload/v1750893404/FPgenerica_avvayb.jpg'}
              alt={profileUser.username}
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                border: `3px solid ${currentTeam.primaryColor}`,
                boxShadow: `0 0 20px ${currentTeam.primaryColor}80`,
              }}
            />

            {isOwnProfile && (
              <Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-pic-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="profile-pic-upload">
                  <Button variant="outlined" size="small" component="span" startIcon={<CloudUploadIcon />}>
                    Elegir Foto
                  </Button>
                </label>
                {selectedFile && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleUpload}
                    disabled={uploading}
                    sx={{ ml: 1, mt: { xs: 1, sm: 0 } }}
                  >
                    {uploading ? <CircularProgress size={18} color="inherit" /> : 'Subir'}
                  </Button>
                )}
                {uploadSuccess && <Alert severity="success" sx={{ mt: 1, py: 0 }}>{uploadSuccess}</Alert>}
                {uploadError && <Alert severity="error" sx={{ mt: 1, py: 0 }}>{uploadError}</Alert>}
              </Box>
            )}
          </Grid>

          {/* User Info & Stats */}
          <Grid item xs={12} sm={8}>
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
              <Typography variant="h4" className="font-racing" sx={{ fontWeight: 800, color: '#ffffff' }}>
                {profileUser.username}
              </Typography>
              {profileUser.isAdmin && (
                <Chip label="ADMIN" color="warning" size="small" className="font-racing" sx={{ fontWeight: 700 }} />
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {profileUser.email} • Miembro desde {new Date(profileUser.createdAt).toLocaleDateString('es-ES')}
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
              <Paper sx={{ p: 2, borderRadius: 2, minWidth: 120, bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
                <Typography variant="caption" color="text.secondary" className="font-racing">
                  PUNTOS TOTALES
                </Typography>
                <Typography variant="h4" className="font-racing" color="primary" sx={{ fontWeight: 800 }}>
                  {profileUser.totalScore || 0}
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 2, minWidth: 120, bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
                <Typography variant="caption" color="text.secondary" className="font-racing">
                  PREDICCIONES
                </Typography>
                <Typography variant="h4" className="font-racing" color="secondary" sx={{ fontWeight: 800 }}>
                  {predictions.length}
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Team Selector for Profile Owner */}
        {isOwnProfile && (
          <>
            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
            <Box>
              <Typography variant="h6" className="font-racing" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon color="primary" /> TEMA DE EQUIPO FAVORITO
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="team-select-label">Equipo de F1</InputLabel>
                <Select
                  labelId="team-select-label"
                  value={selectedTeamTheme}
                  label="Equipo de F1"
                  onChange={handleTeamThemeChange}
                  disabled={savingTheme}
                >
                  {F1_TEAMS.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: team.primaryColor,
                            border: '1px solid rgba(255,255,255,0.3)',
                          }}
                        />
                        {team.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {themeSaveSuccess && <Alert severity="success" sx={{ mt: 1 }}>{themeSaveSuccess}</Alert>}
              {themeSaveError && <Alert severity="error" sx={{ mt: 1 }}>{themeSaveError}</Alert>}
            </Box>
          </>
        )}
      </Paper>

      {/* Predictions History */}
      <Typography variant="h5" className="font-racing" sx={{ mb: 3, color: '#ffffff' }}>
        HISTORIAL DE PREDICCIONES
      </Typography>

      {predictions.length === 0 ? (
        <Paper className="glass-card" sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Este usuario aún no ha realizado predicciones.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {predictions.map((pred) => (
            <Grid item xs={12} key={pred._id}>
              <Card className="glass-card" sx={{ p: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" className="font-racing" sx={{ color: '#fff' }}>
                      {pred.race?.name || 'Gran Premio'}
                    </Typography>
                    <Chip
                      label={`+${pred.score || 0} PTS`}
                      color={pred.score > 0 ? 'success' : 'default'}
                      size="small"
                      className="font-racing"
                      sx={{ fontWeight: 800 }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Fecha: {formatRaceDate(pred.race?.date)} • Estado:{' '}
                    {pred.race?.isRaceCompleted ? 'Finalizada' : 'Pendiente'}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">1º Ganador</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFD700' }}>
                        {pred.predictedWinner}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">2º Puesto</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#C0C0C0' }}>
                        {pred.predictedSecond}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">3º Puesto</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#CD7F32' }}>
                        {pred.predictedThird}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default UserProfilePage;
