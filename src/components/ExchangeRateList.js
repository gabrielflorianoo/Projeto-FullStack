import React, { useMemo } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import useFetchData from '../hooks/useFetchData';

const ExchangeRateList = () => {
  const { data, error } = useFetchData('https://data.fixer.io/api/latest', {
    access_key: 'YOUR_API_KEY',
    base: 'EUR',
  });

  const popularCurrencies = useMemo(() => ['USD', 'GBP', 'JPY', 'BRL'], []);

  // Verifica se os dados estão carregados corretamente
  if (error) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={3}>
        Erro ao carregar as taxas de câmbio.
      </Typography>
    );
  }

  if (!data || !data.rates) {
    return (
      <Typography variant="h6" textAlign="center" mt={3}>
        Dados de câmbio não disponíveis.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Taxas de Câmbio Populares (Base: EUR)
      </Typography>
      <List>
        {popularCurrencies.map((currency) => (
          <ListItem key={currency}>
            <ListItemText
              primary={`${currency}: ${data.rates[currency]?.toFixed(2) || 'N/A'}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ExchangeRateList;
