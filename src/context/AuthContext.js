import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getSession, createSession } from '../api/Backend';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const userData = await getSession();
                    console.log(userData);
                    setUser(userData);
                } catch (error) {
                    console.error('Erro ao buscar usuário:', error);
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await loginUser(credentials);
            console.log(response, response.status);
            if (response.status === 200) {
                // Criar sessão e salvar o ID do usuário no localStorage
                const userId = response.data.userId;
                localStorage.setItem('userId', userId);
                const userData = await getSession();
                console.log(userData);
                setUser(userData);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('userId');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);