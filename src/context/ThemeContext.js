import React, { createContext, useContext } from 'react';
import useThemeSwitcher from '../hooks/useThemeSwitcher';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Cria o contexto para o tema
const ThemeContext = createContext();

// Provedor de tema que encapsula a lógica
export const ThemeContextProvider = ({ children }) => {
    const { theme, toggleTheme } = useThemeSwitcher('light');

    // Define os temas claro e escuro
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

    // Define o tema atual baseado no estado
    const currentTheme = theme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
        </ThemeContext.Provider>
    );
};

// Hook personalizado para usar o tema
export const useThemeContext = () => useContext(ThemeContext);
