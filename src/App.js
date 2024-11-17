import React from 'react';
import { Container, Box } from '@mui/material';
import Introduction from './components/Introduction';
import CurrencyConverter from './components/CurrencyConverter';

const App = () => (
  <Container
    sfx={{
      background: 'linear-gradient(120deg, #50E3C2, #F5A623)',
      height: '100vh',
      display: 'grid',
      gap: 2,
    }}
    disableGutters maxWidth={false}>
    {/* Camada de introdução */}
    <Introduction />

    {/* Conversor de Moedas */}
    <Box>
      <CurrencyConverter />
    </Box>
  </Container>
);

export default App;
