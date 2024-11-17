import React from 'react';
import { Box, Typography } from '@mui/material';

const Introduction = () => (
  <Box
    sx={{
      height: '60vh',
      backgroundImage: 'linear-gradient(120deg, #50E3C2, #F5A623)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      textAlign: 'center',
    }}
  >
    <Box>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
        Bem-vindo ao Conversor de Moedas
      </Typography>
      <Typography variant="h6">
        Converta moedas de forma rápida e fácil com um design moderno.
      </Typography>
    </Box>
  </Box>
);

export default Introduction;
