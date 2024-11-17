import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box
    sx={{
      background: 'linear-gradient(90deg, #4A90E2, #50E3C2)',
      color: '#fff',
      textAlign: 'center',
      py: 3,
      mt: 4,
    }}
  >
    <Typography variant="body2" fontWeight={500}>
      © 2024 Conversor de Moedas. Desenvolvido com ❤️ por Robson e Gabriel.
    </Typography>
  </Box>
);

export default Footer;
