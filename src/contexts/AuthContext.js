// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'; // ¡Añadir useCallback!
import axios from 'axios';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Envuelve `logout` en `useCallback` para evitar re-renders infinitos del useEffect.
    // `logout` no depende de nada que cambie en su propio scope, así que su array de dependencias está vacío.
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['x-auth-token'];
    }, []); // Sin dependencias para logout

    // Envuelve `fetchUser` en `useCallback` y añade `logout` como dependencia.
    // `fetchUser` se volverá a crear solo si `logout` cambia (lo cual no sucederá gracias a useCallback).
    const fetchUser = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/auth/user`);
            setUser(res.data);
        } catch (err) {
            console.error('Error fetching user:', err.response ? err.response.data : err.message);
            logout(); // `fetchUser` ahora depende de `logout`
        } finally {
            setLoading(false);
        }
    }, [logout]); // `fetchUser` depende de `logout`

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
            fetchUser();
        } else {
            delete axios.defaults.headers.common['x-auth-token'];
            setLoading(false);
        }
    }, [token, fetchUser]); // ¡Añadir `fetchUser` al array de dependencias!

    // ... (el resto de tus funciones login, register, etc.)

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            return { success: true };
        } catch (err) {
            console.error('Login error:', err.response ? err.response.data : err.message);
            // ¡Asegurarnos de que siempre se devuelva un objeto!
            return { success: false, error: err.response?.data?.msg || 'Error de login' };
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/register`, { username, email, password });
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            return { success: true };
        } catch (err) {
            console.error('Register error:', err.response ? err.response.data : err.message);
            // ¡Asegurarnos de que siempre se devuelva un objeto!
            return { success: false, error: err.response?.data?.msg || 'Error de registro' };
        }
    };


    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);