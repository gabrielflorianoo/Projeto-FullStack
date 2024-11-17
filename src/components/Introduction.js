import React from 'react';
import { Box, Button, Container } from '@mui/material';

const Introduction = () => (
  <>
    <Container
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        component="img"
        src='images/coinvertLogo.png'
        alt="imagem da moeda"
        sx={{
          height: 'auto',
          borderRadius: 2,
          mb: 2,
          cursor: 'pointer',
        }}
        onClick={() => {
          window.location.href = '/';
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            width: 'fit-content',
            height: 'fit-content',
          }}
          onClick={() => {
            window.location.href = '/converter';
          }}
        >
          Converter Moedas
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            width: 'fit-content',
            height: 'fit-content',
          }}
          onClick={() => {
            window.location.href = '/creditos';
          }}
        >Creditos</Button>
      </Box>
    </Container>
  </>
);

export default Introduction;
