import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Introduction from './Introduction';

import useThemeSwitcher from '../hooks/useThemeSwitcher';
import useLocalStorage from '../hooks/useLocalStorageData';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const Home = () => {
    const { theme } = useThemeSwitcher(useLocalStorage('theme'));

    // Cria os temas
    const lightTheme = createTheme({
        palette: {
            mode: 'light',
            background: {
                default: '#f4f6f8',
                paper: '#fff',
            },
            text: {
                primary: '#000',
                secondary: '#555',
            },
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
        },
    });

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#1e1e1e',
            },
            text: {
                primary: '#fff',
                secondary: '#aaa',
            },
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
        },
    });

    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <Container
                sx={{
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    height: '100vh',
                    display: 'grid',
                    gap: 2,
                }}
                disableGutters
                maxWidth={false}
            >
                <Introduction />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h5" component="h1" gutterBottom>
                        Obrigado por usar nosso serviço!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Estamos felizes em saber que você está utilizando nosso serviço de
                        conversão de moedas. Nossa equipe trabalha arduamente para
                        garantir que você tenha a melhor experiência possível.
                    </Typography>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Home;

