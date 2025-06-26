// frontend/src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
//import CloseIcon from '@mui/icons-material/Close'; // Opcional, para icono de cierre
import { IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';

function Navbar() {
    const { user, logout } = useAuth(); // Obtén el objeto `user` del contexto
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Botón de Hamburguesa para móviles */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }} // Visible solo en móviles
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        F1 BET
                    </Link>
                </Typography>

                {/* Botones de navegación para desktop */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}> {/* Esconder en móviles */}
                    {/* Tus botones actuales aquí: Carreras, Ranking, Admin, Perfil, Login/Registro */}
                    <Button color="inherit" component={Link} to="/">Inicio</Button>
                    <Button color="inherit" component={Link} to="/races">Carreras</Button>
                    <Button color="inherit" component={Link} to="/ranking">Ranking</Button>
                    {user ? (
                        <>
                            {user.isAdmin && (
                                <Button color="inherit" component={Link} to="/admin">Administración</Button>
                            )}
                            <Button color="inherit" component={Link} to={`/profile/${user._id}`}>
                                {user.username}
                            </Button>
                            <Button color="inherit" onClick={logout}>Cerrar Sesión</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">Iniciar Sesión</Button>
                            <Button color="inherit" component={Link} to="/register">Registrarse</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
            {/* Menú deslizante (Drawer) para móviles */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }} // Para un mejor rendimiento móvil
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }, // Ancho del menú
                }}
            >
                {/* Contenido del menú deslizante */}
                <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        F1 BET
                    </Typography>

                    <List>
                        <ListItem component={Link} to="/" onClick={handleDrawerToggle}>
                            <ListItemText primary="Inicio" />
                        </ListItem>
                        <ListItem component={Link} to="/races" onClick={handleDrawerToggle}>
                            <ListItemText primary="Carreras" />
                        </ListItem>
                        <ListItem component={Link} to="/ranking" onClick={handleDrawerToggle}>
                            <ListItemText primary="Ranking" />
                        </ListItem>
                        {user ? (
                            <>
                                {user.isAdmin && (
                                    <ListItem component={Link} to="/admin" onClick={handleDrawerToggle}>
                                        <ListItemText primary="Administración" />
                                    </ListItem>
                                )}
                                <ListItem component={Link} to={`/profile/${user._id}`} onClick={handleDrawerToggle}>
                                    <ListItemText primary={`${user.username}`} />
                                </ListItem>
                                <ListItem onClick={() => { logout(); handleDrawerToggle(); }}>
                                    <ListItemText primary="Cerrar Sesión" />
                                </ListItem>
                            </>
                        ) : (
                            <>
                                <ListItem component={Link} to="/login" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Iniciar Sesión" />
                                </ListItem>
                                <ListItem component={Link} to="/register" onClick={handleDrawerToggle}>
                                    <ListItemText primary="Registrarse" />
                                </ListItem>
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
}

export default Navbar;