import React from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';

const Footer = () => {
    const { theme } = useThemeContext();

    return (
        <Box
            sx={{
                backgroundColor: theme === 'dark' ? '#4A90E2' : '#50E3C2',
                textAlign: 'center',
                color: '#fff',
                py: 3,
                mt: 4,
            }}
        >
            <Typography fontWeight={500}>
                © 2024 Conversor de Moedas. Desenvolvido com ❤️ por Robson e
                Gabriel.
            </Typography>
        </Box>
    );
};

export default Footer;
