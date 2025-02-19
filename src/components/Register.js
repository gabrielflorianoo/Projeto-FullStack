import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Box, TextField, Button, Typography, Container, Alert } from '@mui/material';

const Register = () => {
    const { theme } = useThemeContext();
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async () => {
        try {
            const response = await register({ name, email, password });
            setSuccessMessage('Conta registrada com sucesso! Redirecionando...');
            setError('');
            setTimeout(() => navigate('/'), 3000); // Redireciona após 3 segundos
        } catch (err) {
            console.log(err)
            setError('Erro ao registrar. ' + err.response?.data.error || err.message);
            setSuccessMessage('');
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
                <Typography variant="h4">Registrar</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                <TextField
                    label="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
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
                <Button variant="contained" color="primary" onClick={handleRegister}>
                    Registrar
                </Button>
                <Button variant="text" color="secondary" onClick={() => navigate('/login')}>
                    Já tem uma conta? Login
                </Button>
                <Button variant="text" color="secondary" onClick={() => navigate('/')}>
                    Voltar para o início
                </Button>
            </Box>
        </Container>
    );
};

export default Register;
