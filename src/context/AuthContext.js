import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getSession, logoutUser, createUser } from '../api/Backend';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const session = await getSession();
        if (session.token) {
                setUser(session.token.userId);
            } else {
                setUser(null);
                console.log('Usuário não autenticado');
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await loginUser(credentials);
            setUser(response.token.userId);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    const register = async (credentials) => {
        try {
            const response = await createUser(credentials);
            setUser(response.token.userId);
        } catch (error) {
            console.error('Erro ao registrar:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);