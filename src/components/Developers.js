import React from 'react';
import { Box, Typography, Avatar, Button, Container } from '@mui/material';
import Footer from './Footer';
import Introduction from './Introduction';
import { useNavigate } from 'react-router-dom';

const Developers = () => {
    const navigate = useNavigate();

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
            <Box textAlign="center">
                <Introduction />
                <Typography variant="h4" gutterBottom>
                    Desenvolvedores
                </Typography>
                <Box
                    display="flex"
                    justifyContent="center"
                    gap={4}
                    mt={3}
                    sx={{
                        '& .MuiAvatar-root': {
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                            },
                        },
                    }}
                >
                    <Box textAlign="center">
                        <Avatar
                            alt="Robson Carvalho"
                            src="https://avatars.githubusercontent.com/u/55316471?v=4"
                            sx={{ width: 100, height: 100, margin: '0 auto' }}
                        />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Robson Carvalho
                        </Typography>
                    </Box>
                    <Box textAlign="center">
                        <Avatar
                            alt="Gabriel Floriano"
                            src="https://avatars.githubusercontent.com/u/55316471?v=4"
                            sx={{ width: 100, height: 100, margin: '0 auto' }}
                        />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Gabriel Floriano
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    sx={{ mt: 4 }}
                >
                    Voltar
                </Button>
            </Box>
            <Footer />
        </Container>
    );
};

export default Developers;
