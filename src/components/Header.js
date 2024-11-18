import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = ({ toggleTheme, currentTheme }) => (
  <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #4A90E2, #50E3C2)' }}>
    <Toolbar>
      <Typography
        variant="h6"
        sx={{
          flexGrow: 1,
          fontWeight: 700,
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        Conversor de Moedas
      </Typography>
      <Button
        variant="outlined"
        sx={{
          color: '#fff',
          borderColor: '#fff',
          '&:hover': { backgroundColor: '#50E3C2', borderColor: '#fff' },
        }}
        onClick={toggleTheme}
      >
        Tema: {currentTheme === 'light' ? 'Claro' : 'Escuro'}
      </Button>
    </Toolbar>
  </AppBar>
);
export default Header;