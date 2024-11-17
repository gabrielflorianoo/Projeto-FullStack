import React, { useState, useMemo } from 'react';
import { Box, TextField, Select, MenuItem, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import currencyData from '../api/currencies.json';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1); // Quantia em EUR
  const [targetCurrency, setTargetCurrency] = useState('USD'); // Moeda de destino
  const [conversionRate, setConversionRate] = useState(null); // Taxa de conversão
  const [result, setResult] = useState(null); // Resultado da conversão
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // Lista de moedas disponíveis, exceto EUR
  const currencyOptions = useMemo(
    () => currencyData.currencies.filter((currency) => currency !== 'EUR'),
    []
  );

  // Função para converter moedas
  const handleConvert = async () => {
    setLoading(true); // Inicia o estado de carregamento
    try {
      const response = await axios.get(`https://data.fixer.io/api/latest`, {
        params: {
          access_key: 'dcc4215d48948f04f6e7dfc58baae0af', 
          base: 'EUR',
          symbols: targetCurrency,
        },
      });

      const rate = response.data.rates[targetCurrency]; // Obtém a taxa de conversão
      setConversionRate(rate); // Atualiza o estado da taxa
      setResult((amount * rate).toFixed(2)); // Calcula o valor convertido
    } catch (error) {
      console.error('Erro ao buscar taxa de conversão:', error);
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  return (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        Conversão de Moedas
      </Typography>
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        <TextField
          label="Valor em EUR"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
        >
          {currencyOptions.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleConvert}
        disabled={loading}
        sx={{
          '&:hover': { backgroundColor: '#333' },
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Converter'}
      </Button>
      {conversionRate && (
        <Typography variant="h6" mt={3}>
          Taxa de Conversão: 1 EUR = {conversionRate.toFixed(4)} {targetCurrency}
        </Typography>
      )}
      {result && (
        <Typography variant="h6" mt={2}>
          {amount} EUR = {result} {targetCurrency}
        </Typography>
      )}
    </Box>
  );
};

export default CurrencyConverter;