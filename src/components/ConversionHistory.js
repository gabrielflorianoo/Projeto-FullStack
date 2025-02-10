import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from '@mui/material';
import { getAllConversions } from '../api/Backend';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ConversionHistory = () => {
    const { user } = useAuth();
    const [conversions, setConversions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversions = async () => {
            try {
                const data = await getAllConversions();
                setConversions(data);
            } catch (error) {
                console.error('Erro ao buscar histórico de conversões:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchConversions();
        }
    }, [user]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Histórico de Conversões
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Data</TableCell>
                            <TableCell>Moeda Alvo</TableCell>
                            <TableCell>Taxa de Câmbio</TableCell>
                            <TableCell>Valor Usado</TableCell>
                            <TableCell>Resultado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {conversions ? (conversions.map((conversion) => (
                            <TableRow key={conversion._id}>
                                <TableCell>{new Date(conversion.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{conversion.targetCurrency}</TableCell>
                                <TableCell>{conversion.exchangeRate.toFixed(2)}</TableCell>
                                <TableCell>{conversion.amountUsed}</TableCell>
                                <TableCell>{(conversion.amountUsed * conversion.exchangeRate).toFixed(2)}</TableCell>
                            </TableRow>
                        ))) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Nenhuma conversão realizada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" marginTop={2}>
                <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                    Voltar ao Início
                </Button>
            </Box>
        </Box>
    );
};

export default ConversionHistory;