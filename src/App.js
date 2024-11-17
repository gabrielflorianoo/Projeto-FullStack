import React from 'react';
import { Container, Box } from '@mui/material';
import Introduction from './components/Introduction';
import CurrencyConverter from './components/CurrencyConverter';
import Developers from './components/Developers';

const App = () => (
  <Container disableGutters maxWidth={false}>
    {/* Camada de introdução */}
    <Box
      sx={{
        height: '60vh', // Altura consistente com as demais camadas
        width: '100%',
      }}
    >
      <Introduction />
    </Box>

    {/* Conversor de Moedas */}
    <Box
      sx={{
        background: 'linear-gradient(120deg, #50E3C2, #F5A623)',
        color: '#333',
        py: 5,
        height: '60vh', // Altura consistente com a introdução
      }}
    >
      <CurrencyConverter />
    </Box>

    {/* Desenvolvedores */}
    <Box
      sx={{
        background: 'linear-gradient(120deg, #F5A623, #FF416C)',
        color: '#fff',
        py: 5,
        height: '60vh', // Altura consistente com as demais camadas
      }}
    >
      <Developers />
    </Box>
  </Container>
);

export default App;
