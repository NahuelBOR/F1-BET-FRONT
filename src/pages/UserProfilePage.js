import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Typography, Box, CircularProgress, Alert,
    Card, CardContent, Divider, Grid, List, ListItem, ListItemText,
    Button, Avatar, FormControl, InputLabel, Select, MenuItem // Importaciones para el selector de tema
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config'; // Importa la URL base de tu API
import { useAuth } from '../contexts/AuthContext'; // Para el usuario logueado y sus acciones
import F1_TEAMS from '../data/f1Teams'; // Importa la lista de equipos de F1


function UserProfilePage() {
    const { id } = useParams(); // ID del usuario cuyo perfil se está viendo
    // user: currentUser es el usuario actualmente logueado
    // token es el token de autenticación
    // fetchUser es para refrescar los datos del usuario en el contexto
    // updateUserPreferences es para enviar la preferencia de tema al backend
    const { user: currentUser, token, fetchUser, updateUserPreferences } = useAuth();

    const [profileUser, setProfileUser] = useState(null); // Datos del usuario del perfil que se muestra
    const [predictions, setPredictions] = useState([]); // Historial de predicciones de ese usuario
    const [loading, setLoading] = useState(true); // Estado de carga inicial de la página
    const [error, setError] = useState(null); // Mensajes de error generales

    // --- Estados para la funcionalidad de subida de foto de perfil ---
    const [selectedFile, setSelectedFile] = useState(null); // Archivo seleccionado para subir
    const [uploading, setUploading] = useState(false); // Indica si la subida está en progreso
    const [uploadSuccess, setUploadSuccess] = useState(null); // Mensaje de éxito de subida de foto
    const [uploadError, setUploadError] = useState(null); // Mensaje de error de subida de foto
    // --- Fin Estados Foto Perfil ---

    // --- Estados para la funcionalidad de selección de tema ---
    const [selectedTeamTheme, setSelectedTeamTheme] = useState(''); // El ID del equipo seleccionado en el dropdown
    const [savingTheme, setSavingTheme] = useState(false); // Indica si se está guardando la preferencia de tema
    const [themeSaveSuccess, setThemeSaveSuccess] = useState(null); // Mensaje de éxito al guardar el tema
    const [themeSaveError, setThemeSaveError] = useState(null); // Mensaje de error al guardar el tema
    // --- Fin Estados Selección Tema ---


    // useEffect para cargar los datos del perfil y las predicciones al montar el componente
    // o cuando cambie el ID del perfil o el token
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) {
                setError('Debes iniciar sesión para ver perfiles de usuario.');
                setLoading(false);
                return;
            }

            try {
                // Obtener datos del usuario del perfil (ruta pública para cualquier perfil)
                const userRes = await axios.get(`${API_BASE_URL}/users/${id}`);
                setProfileUser(userRes.data);
                // Establece el equipo seleccionado al cargar el perfil.
                // Si el usuario no tiene una preferencia guardada, usa 'default'.
                setSelectedTeamTheme(userRes.data.preferredTeamTheme || 'default');

                // Obtener predicciones del usuario (ruta protegida, requiere token)
                const predictionsRes = await axios.get(`${API_BASE_URL}/predictions/user/${id}`, {
                    headers: { 'x-auth-token': token } // Asegúrate de que el token se envíe
                });
                setPredictions(predictionsRes.data);

            } catch (err) {
                console.error('Error fetching user profile or predictions:', err.response ? err.response.data : err.message);
                // Manejo de errores más específico
                if (err.response && err.response.status === 403) {
                    setError('No tienes permiso para ver las predicciones de este usuario.');
                } else if (err.response && err.response.status === 404) {
                    setError('Usuario o predicciones no encontradas.');
                } else {
                    setError('No se pudo cargar el perfil del usuario o sus predicciones. Asegúrate de estar logueado.');
                }
            } finally {
                setLoading(false); // Termina el estado de carga
            }
        };
        fetchUserProfile();
    }, [id, token]); // Dependencias: id (de la URL) y token (de AuthContext)

    // --- Funciones para la funcionalidad de foto de perfil ---
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setUploadSuccess(null); // Limpiar mensajes de éxito/error anteriores
        setUploadError(null); // Usar el estado de error de subida específico
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadError('Por favor, selecciona una imagen para subir.');
            return;
        }

        setUploading(true); // Iniciar estado de subida
        setUploadError(null);
        setUploadSuccess(null);

        const formData = new FormData();
        formData.append('profilePicture', selectedFile); // 'profilePicture' debe coincidir con el nombre del campo en Multer (upload.single('profilePicture'))

        try {
            // Llama al endpoint de subida de Cloudinary en tu backend
            const res = await axios.post(`${API_BASE_URL}/upload/profile-picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Crucial para subir archivos
                    'x-auth-token': token // Autenticación
                }
            });
            setUploadSuccess(res.data.msg); // Mensaje de éxito del backend
            // Actualiza el estado local del usuario de perfil con la nueva URL de la imagen
            setProfileUser(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
            // ¡IMPORTANTE! Refresca el usuario en el AuthContext para que la Navbar y otros componentes
            // que usen el contexto global se actualicen con la nueva foto de perfil.
            fetchUser();
            setSelectedFile(null); // Limpia el input del archivo después de la subida exitosa
        } catch (err) {
            console.error('Error uploading profile picture:', err.response ? err.response.data : err.message);
            setUploadError(err.response?.data?.msg || 'Error al subir la imagen. Intenta con un archivo más pequeño o de otro formato.');
        } finally {
            setUploading(false); // Finaliza el estado de subida
        }
    };
    // --- Fin Funciones Foto Perfil ---

    // --- Función para manejar el cambio de tema del equipo ---
    const handleTeamThemeChange = async (event) => {
        const newTeamId = event.target.value; // Obtiene el ID del equipo seleccionado
        setSelectedTeamTheme(newTeamId); // Actualiza el estado local para reflejar la selección
        setSavingTheme(true); // Inicia estado de guardado
        setThemeSaveSuccess(null); // Limpia mensajes anteriores
        setThemeSaveError(null);

        // Llama a la función del AuthContext para enviar la preferencia al backend
        const success = await updateUserPreferences({ preferredTeamTheme: newTeamId });

        if (success) {
            setThemeSaveSuccess('Preferencia de tema actualizada con éxito.');
            // El AuthContext ya actualizó el objeto 'user', lo que dispara la actualización del tema en App.js
        } else {
            setThemeSaveError('Error al guardar la preferencia de tema.');
        }
        setSavingTheme(false); // Finaliza estado de guardado
    };
    // --- Fin Función Selección Tema ---


    // Función auxiliar para formatear la fecha de la carrera
    const formatRaceDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // --- Renderizado Condicional: Carga, Errores, No Encontrado ---
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error && !profileUser) {
        // Mostrar un error general si no se pudo cargar el perfil por completo
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!profileUser) {
        // Si no se encontró el usuario después de cargar (ej. ID inválido)
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="warning">Usuario no encontrado.</Alert>
            </Container>
        );
    }

    // --- Renderizado del Contenido Principal del Perfil ---
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Perfil de {profileUser.username}
                        {profileUser.isAdmin && ( // Muestra etiqueta "Admin" si el usuario lo es
                            <Typography variant="caption" color="primary" sx={{ ml: 1, fontWeight: 'bold' }}>
                                (Admin)
                            </Typography>
                        )}
                    </Typography>
                    {/* Muestra "Mi Perfil" si el usuario logueado es el mismo que el perfil que se ve */}
                    {currentUser && currentUser._id === id && (
                        <Typography variant="h6" color="text.secondary" align="center">(Mi Perfil)</Typography>
                    )}
                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={3} alignItems="center">
                        {/* Sección de Avatar y Subida de Foto */}
                        <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                            <Avatar
                                // El src del Avatar ahora apunta directamente a la URL de Cloudinary
                                // que está almacenada en profileUser.profilePicture.
                                // Si profileUser.profilePicture es nulo o una cadena vacía,
                                // se usa la imagen por defecto '/default-avatar.png' de la carpeta public.
                                src={profileUser.profilePicture || '/default-avatar.png'}
                                alt={profileUser.username}
                                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                            />
                            {/* Controles de subida de imagen, solo si es el propio usuario logueado */}
                            {currentUser && currentUser._id === id && (
                                <Box sx={{ mt: 2 }}>
                                    {/* Input de tipo file oculto, se activa con el botón "Seleccionar Foto" */}
                                    <input
                                        accept="image/*" // Solo acepta archivos de imagen
                                        style={{ display: 'none' }} // Oculta el input por defecto del navegador
                                        id="raised-button-file"
                                        type="file" // Para seleccionar un solo archivo
                                        onChange={handleFileChange} // Maneja la selección de archivo
                                    />
                                    {/* Etiqueta que actúa como un botón para activar el input file */}
                                    <label htmlFor="raised-button-file">
                                        <Button variant="outlined" component="span">
                                            Seleccionar Foto
                                        </Button>
                                    </label>
                                    {/* Botón para subir el archivo seleccionado */}
                                    <Button
                                        variant="contained"
                                        sx={{ ml: 1 }}
                                        onClick={handleUpload} // Maneja la subida
                                        disabled={!selectedFile || uploading} // Deshabilita si no hay archivo o está subiendo
                                    >
                                        {uploading ? <CircularProgress size={24} /> : 'Subir'}
                                    </Button>
                                    {/* Mensajes de feedback para la subida de foto */}
                                    {uploadSuccess && <Alert severity="success" sx={{ mt: 1 }}>{uploadSuccess}</Alert>}
                                    {uploadError && <Alert severity="error" sx={{ mt: 1 }}>{uploadError}</Alert>}
                                </Box>
                            )}
                        </Grid>

                        {/* Información General del Usuario y Selector de Tema */}
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h6">Información General</Typography>
                            <Typography>
                                {profileUser.email}
                            </Typography>
                            <Typography>
                                Miembro desde: {new Date(profileUser.createdAt).toLocaleDateString('es-ES')}
                            </Typography>
                            <Typography variant="h5" sx={{ mt: 2 }}>
                                Puntaje Total: {profileUser.totalScore} puntos
                            </Typography>

                            {/* Sección de Selección de Tema, solo visible para el propio usuario logueado */}
                            {currentUser && currentUser._id === id && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Preferencias de Tema
                                    </Typography>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="team-theme-select-label">Equipo de F1 Favorito</InputLabel>
                                        <Select
                                            labelId="team-theme-select-label"
                                            id="team-theme-select"
                                            value={selectedTeamTheme}
                                            label="Equipo de F1 Favorito"
                                            onChange={handleTeamThemeChange}
                                            disabled={savingTheme} // Deshabilitar mientras se guarda
                                        >
                                            {F1_TEAMS.map((team) => (
                                                <MenuItem key={team.id} value={team.id}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {/* Pequeño círculo de color para previsualizar el tema */}
                                                        <Box sx={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            bgcolor: team.primaryColor,
                                                            mr: 1, // Margen derecho
                                                            border: '1px solid #ccc' // Borde para visibilidad en colores claros
                                                        }} />
                                                        {team.name}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {savingTheme && <CircularProgress size={24} sx={{ mt: 1 }} />}
                                    {themeSaveSuccess && <Alert severity="success" sx={{ mt: 1 }}>{themeSaveSuccess}</Alert>}
                                    {themeSaveError && <Alert severity="error" sx={{ mt: 1 }}>{themeSaveError}</Alert>}
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />

                    {/* Historial de Predicciones del Usuario */}
                    <Box>
                        <Typography variant="h6">Historial de Predicciones</Typography>
                        {predictions.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                Este usuario aún no ha realizado predicciones o no tiene historial disponible.
                            </Typography>
                        ) : (
                            <List dense>
                                {predictions.map((pred) => (
                                    <ListItem key={pred._id} divider>
                                        <ListItemText
                                            primary={`Predicción para ${pred.race.name} (${formatRaceDate(pred.race.date)})`}
                                            secondary={
                                                <Box component="span" sx={{ display: 'block' }}>
                                                    1º: {pred.predictedWinner}
                                                    <br />
                                                    2º: {pred.predictedSecond}
                                                    <br />
                                                    3º: {pred.predictedThird}
                                                    <br />
                                                    Puntos obtenidos: {pred.score}
                                                    <br />
                                                    Estado Carrera: {pred.race.isRaceCompleted ? 'Finalizada' : 'Pendiente'}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

export default UserProfilePage;
