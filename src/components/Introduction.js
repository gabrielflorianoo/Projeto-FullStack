import React from 'react';
import { Box } from '@mui/material';

const Introduction = () => (
  <Box
    sx={{
      width: '500px', // Largura total da camada
      height: '504px', // Altura total da tela
      backgroundImage: 'url(/images/coinvert.png)', // Caminho da imagem
      backgroundPosition: 'center', // Centraliza a imagem
      backgroundRepeat: 'no-repeat', // Evita repetição
    }}
  />
);

export default Introduction;
