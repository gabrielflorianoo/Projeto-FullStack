import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const Developers = () => (
  <Box textAlign="center">
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
        <Avatar alt="Robson" sx={{ width: 100, height: 100, margin: '0 auto' }} />
        <Typography variant="body1" sx={{ mt: 1 }}>
          Robson Carvalho
        </Typography>
      </Box>
      <Box textAlign="center">
        <Avatar alt="Gabriel" sx={{ width: 100, height: 100, margin: '0 auto' }} />
        <Typography variant="body1" sx={{ mt: 1 }}>
          Gabriel Floriano
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default Developers;
