import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { Box, TextField, Button, Typography, Container } from '@mui/material';

const Login = () => {
    const { theme } = useThemeContext();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await login({ email, password });
            navigate('/'); // Redireciona para a página inicial
        } catch (err) {
            if (err.status === 429) {
                setError('Muitas tentativas de login. Tente novamente mais tarde.');
                return;
            }
            setError('Email ou senha inválidos');
        }
    };

    return (
        <Container
            sx={{
                bgcolor: 'background.default',
                color: 'text.primary',
                height: '100vh',
                display: 'grid',
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            disableGutters
            maxWidth={false}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: theme === 'light' ? '0 4px 8px rgba(0, 0, 0, 0.1)' : '0 4px 8px rgba(255, 255, 255, 0.1)',
                }}
            >
                <Typography variant="h4">Login</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleLogin}>
                    Entrar
                </Button>
                <Button variant="text" color="secondary" onClick={() => navigate('/registrar')}>
                    Registrar
                </Button>
                <Button variant="text" color="secondary" onClick={() => navigate('/')}>
                    Voltar para o inicio
                </Button>
            </Box>
        </Container>
    );
};

export default Login;