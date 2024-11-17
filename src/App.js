import React from 'react';
import { Container, Box } from '@mui/material';
import Introduction from './components/Introduction';
import CurrencyConverter from './components/CurrencyConverter';
import ExchangeRateList from './components/ExchangeRateList';
import Developers from './components/Developers';
import Footer from './components/Footer';
import Header from './components/Header';
import useThemeSwitcher from './hooks/useThemeSwitcher';

const App = () => {
  const { theme, toggleTheme } = useThemeSwitcher();

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        bgcolor: theme === 'light' ? '#f4f6f8' : '#121212',
        color: theme === 'light' ? '#000' : '#fff',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <Header toggleTheme={toggleTheme} currentTheme={theme} />
      <Box>
        <Introduction />
        <Box sx={{ py: 5 }}>
          <CurrencyConverter />
        </Box>
        <Box sx={{ py: 5 }}>
          <ExchangeRateList />
        </Box>
        <Developers />
      </Box>
      <Footer />
    </Container>
  );
};

export default App;
