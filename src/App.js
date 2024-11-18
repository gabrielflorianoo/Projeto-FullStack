import React from 'react';
import { Container, Box } from '@mui/material';
import Introduction from './components/Introduction';
import CurrencyConverter from './components/CurrencyConverter';

import useThemeSwitcher from './hooks/useThemeSwitcher';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const App = () => {
  const { theme, toggleTheme } = useThemeSwitcher('light'); // Define o tema inicial como "light"

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
        {/* Passa a função de alternar tema para o componente Introduction */}
        <Introduction theme={theme} toggleTheme={toggleTheme} />

        {/* Conversor de Moeda */}
        <Box>
          <CurrencyConverter />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;