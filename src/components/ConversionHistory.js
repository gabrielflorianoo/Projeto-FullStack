import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from '@mui/material';
import { getAllConversions, getConverterInPeriod, getConverterByCurrency, getConverterByExchangeRate } from '../api/Backend';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ConversionHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState('');
    const [dateFilter, setDateFilter] = useState({});
    const [conversions, setConversions] = useState([]);
    const [exchangeRate, setExchangeRate] = useState({});

    useEffect(() => {
        const fetchConversions = async () => {
            try {
                let data;
                if (dateFilter.startDate && dateFilter.endDate) {
                    data = await getConverterInPeriod(dateFilter);
                } if (currency !== '') {
                    data = await getConverterByCurrency(currency);
                } if (exchangeRate.startValue && exchangeRate.endValue) {
                    data = await getConverterByExchangeRate(exchangeRate);
                } else {
                    data = await getAllConversions();
                }

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
    }, [user, dateFilter, currency, exchangeRate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const handleClearFilter = () => {
        setDateFilter({});
        setLoading(true);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <>
                <Typography variant="h4" gutterBottom>
                    Histórico de Conversões
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} marginBottom={2}>
                    <Button variant="contained" color="primary" onClick={() => navigate('/new-conversion')}>
                        Nova Conversão
                    </Button>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" marginRight={1}>
                            Filtrar por moeda:
                        </Typography>
                        <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" marginRight={1}>
                            Filtrar por taxa de câmbio:
                        </Typography>
                        <input type="number" onChange={(e) => setExchangeRate({ ...exchangeRate, startValue: e.target.value })} />
                        <Typography variant="body1" marginX={1}>
                            até
                        </Typography>
                        <input type="number" onChange={(e) => setExchangeRate({ ...exchangeRate, endValue: e.target.value })} />
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" marginRight={1}>
                            Filtrar por data:
                        </Typography>
                        <input type="date" onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })} />
                        <Typography variant="body1" marginX={1}>
                            até
                        </Typography>
                        <input type="date" onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })} />
                        <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }} onClick={handleClearFilter}>
                            Limpar Filtro
                        </Button>
                    </Box>
                </Box>
            </>
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
                        {conversions && conversions.length > 0 ? (conversions.map((conversion) => (
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