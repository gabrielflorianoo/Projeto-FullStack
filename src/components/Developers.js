import React from 'react';
import { Box, Typography, Avatar, Button, Container } from '@mui/material';
import Introduction from './Introduction';

import { ThemeProvider } from '@mui/material/styles';
import { useThemeContext } from '../context/ThemeContext';

const Developers = () => {
	const { theme, toggleTheme } = useThemeContext();

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
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						window.location.href = '/';
					}}
					target="_blank"
				>Voltar</Button>
			</Box>
		</Container>
	);
}

export default Developers;
