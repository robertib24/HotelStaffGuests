import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api/staff/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser({
                    email: decodedToken.sub,
                    role: decodedToken.authorities[0],
                    name: decodedToken.name 
                });
            } catch (error) {
                console.error("Token invalid:", error);
                setToken(null);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const newToken = response.data.token;
            setToken(newToken);
            localStorage.setItem('token', newToken);
            return true;
        } catch (error) {
            console.error("Eroare la login:", error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const value = {
        token,
        user,
        loading,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}