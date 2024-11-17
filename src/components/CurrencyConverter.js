import React, { useState, useMemo } from 'react';
import { Box, TextField, Select, MenuItem, Button, Typography } from '@mui/material';
import axios from 'axios';
import currencyData from '../api/currencies.json';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1); // Valor em EUR
  const [targetCurrency, setTargetCurrency] = useState('USD'); // Moeda de destino
  const [conversionRate, setConversionRate] = useState(null); // Taxa de conversão
  const [result, setResult] = useState(null); // Resultado da conversão
  const [error, setError] = useState(null); // Estado para armazenar erros

  // Filtra as moedas disponíveis para exibição
  const currencyOptions = useMemo(() => currencyData.currencies.filter((c) => c !== 'EUR'), []);

  // Função para realizar a conversão
  const handleConvert = async () => {
    try {
      setError(null); // Reseta erros anteriores
      setResult(null); // Reseta o resultado anterior

      // Faz a requisição para a API
      const response = await axios.get('https://data.fixer.io/api/latest', {
        params: {
          access_key: 'dcc4215d48948f04f6e7dfc58baae0af',
          base: 'EUR',
          symbols: targetCurrency,
        },
      });

      console.log('Resposta da API:', response.data); // Debug para verificar o retorno da API

      // Verifica se `rates` e a moeda selecionada estão presentes
      const rate = response.data?.rates?.[targetCurrency];
      if (!rate) {
        throw new Error(`Taxa de conversão para ${targetCurrency} não encontrada.`);
      }

      // Atualiza o estado com a taxa e o resultado
      setConversionRate(rate);
      setResult((amount * rate).toFixed(2));
    } catch (err) {
      console.error('Erro ao buscar taxa de conversão:', err);
      setError('Não foi possível obter os dados de conversão. Verifique sua conexão ou tente novamente.');
    }
  };

  return (
    <Box textAlign="center" px={4}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Conversão de Moedas
      </Typography>
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        <TextField
          label="Valor em EUR"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#50E3C2' },
          }}
        />
        <Select
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
          sx={{ '&:hover': { borderColor: '#50E3C2' } }}
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
        sx={{
          background: '#4A90E2',
          '&:hover': {
            background: '#50E3C2',
          },
        }}
        onClick={handleConvert}
      >
        Converter
      </Button>
      {error && (
        <Typography variant="h6" color="error" mt={3}>
          {error}
        </Typography>
      )}
      {result && (
        <Typography variant="h6" mt={3}>
          {amount} EUR = {result} {targetCurrency}
        </Typography>
      )}
      {conversionRate && (
        <Typography variant="body2" mt={2}>
          Taxa de Conversão: 1 EUR = {conversionRate.toFixed(4)} {targetCurrency}
        </Typography>
      )}
    </Box>
  );
};

export default CurrencyConverter;
