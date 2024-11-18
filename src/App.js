import React from 'react';
import { Container, Box } from '@mui/material';
import Introduction from './components/Introduction';
import CurrencyConverter from './components/CurrencyConverter';

import { ThemeProvider } from '@mui/material/styles';
import { useThemeContext } from './context/ThemeContext';

const App = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
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
  );
};

export default App;