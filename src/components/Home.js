import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import Footer from './Footer';
import Introduction from './Introduction';

const Home = () => {
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
            <Introduction />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    Obrigado por usar nosso serviço!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Estamos felizes em saber que você está utilizando nosso serviço de conversão de moedas. <br/> 
                    Nossa equipe trabalha arduamente para garantir que você tenha a melhor experiência possível.
                </Typography>
            </Box>
            <Footer />
        </Container>
    );
};

export default Home;

