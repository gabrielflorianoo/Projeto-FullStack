import React, { useState, useMemo, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, Button, Typography, CircularProgress } from '@mui/material';
import useLocalStorage from '../hooks/useLocalStorageData';
import currencyData from '../api/currencies.json';
import axios from 'axios';

const API_KEY = 'b5f559e5613bbdde3052572c4a482ee0';

const saveToLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const CurrencyConverter = () => {
	const [amount, setAmount] = useState(1); // Quantia em EUR
	const [autoConverter, setAutoConverter] = useState(false); // Conversão automática
	const [targetCurrency, setTargetCurrency] = useState('USD'); // Moeda de destino
	const [conversionRate, setConversionRate] = useState(null); // Taxa de conversão
	const [result, setResult] = useState(null); // Resultado da conversão
	const [loading, setLoading] = useState(false); // Estado de carregamento
	const [lastAmount, setLastAmount] = useState(amount); // Última quantia convertida
	const [lastResult, setLastResult] = useState(null);   // Último resultado convertido

	// Dados salvos no Local Storage
	const savedTargetCurrency = useLocalStorage('targetCurrency');
	const savedConversionRate = useLocalStorage('conversionRate');

	// Moedas disponíveis, exceto EUR
	const currencyOptions = useMemo(
		() => currencyData.currencies.filter((currency) => currency !== 'EUR'),
		[]
	);

	// Atualiza configurações iniciais ao carregar o componente
	useEffect(() => {
		if (savedTargetCurrency) setTargetCurrency(savedTargetCurrency);
		if (savedConversionRate) setConversionRate(savedConversionRate);
	}, [savedTargetCurrency, savedConversionRate]);

	// Atualiza automaticamente a conversão quando `targetCurrency` ou `amount` muda
	useEffect(() => {
		if (autoConverter) handleConvert();
	}, [amount, targetCurrency, autoConverter]);

	// Função para converter moedas
	const handleConvert = async () => {
		setLoading(true);

		// Usa taxa salva no localStorage se possível
		if (conversionRate && savedTargetCurrency === targetCurrency) {
			const conversion = amount * conversionRate;
			setResult(conversion.toFixed(2));
			setLastAmount(amount);
			setLastResult(conversion.toFixed(2));
		} else {
			try {
				const { data } = await axios.get(`https://data.fixer.io/api/latest?access_key=${API_KEY}`, {
					params: { base: 'EUR', symbols: targetCurrency },
				});

				const rate = data.rates[targetCurrency];
				setConversionRate(rate);
				const conversion = amount * rate;
				setResult(conversion.toFixed(2));
				setLastAmount(amount);
				setLastResult(conversion.toFixed(2));

				// Salva dados no localStorage
				saveToLocalStorage('conversionRate', rate);
				saveToLocalStorage('targetCurrency', targetCurrency);
			} catch (error) {
				console.error('Erro ao buscar taxa de conversão:', error);
			}
		}

		setLoading(false);
	};

	const handleAmountChange = (amount) => {
		const newAmount = Number(amount);
		if (!isNaN(newAmount) && newAmount >= 0) {
			setAmount(newAmount);
		} else {
			setAmount('');
		}
	}

	return (
		<Box textAlign="center">
			{/* Botão para ativar/desativar conversão automática */}
			<Button
				variant="contained"
				color={autoConverter ? 'error' : 'primary'}
				onClick={() => setAutoConverter(!autoConverter)}
			>
				{autoConverter ? 'Parar Conversão Automática' : 'Iniciar Conversão Automática'}
			</Button>

			{/* Título */}
			<Typography variant="h4" gutterBottom>Conversão de Moedas</Typography>

			{/* Inputs para valor e moeda */}
			<Box display="flex" justifyContent="center" gap={2} mb={3}>
				<TextField
					label="Valor em EUR"
					type="number"
					value={amount}
					onChange={(e) => handleAmountChange(e.target.value)}
				/>
				<Select
					value={targetCurrency}
					onChange={(e) => setTargetCurrency(e.target.value)}
				>
					{currencyOptions.map((currency) => (
						<MenuItem key={currency} value={currency}>{currency}</MenuItem>
					))}
				</Select>
			</Box>

			{/* Botão para converter */}
			<Button
				variant="contained"
				color="secondary"
				onClick={handleConvert}
				disabled={loading}
				sx={{ '&:hover': { backgroundColor: '#333' } }}
			>
				{loading ? <CircularProgress size={24} color="inherit" /> : 'Converter'}
			</Button>

			{/* Exibição da taxa de conversão */}
			{conversionRate && (
				<Typography variant="h6" mt={3}>
					Taxa de Conversão: 1 EUR = {conversionRate.toFixed(2)} {targetCurrency}
				</Typography>
			)}

			{/* Exibição do resultado */}
			{result && (
				<Typography variant="h6" mt={2}>
					{`${lastAmount} EUR = ${lastResult} ${targetCurrency}`}
				</Typography>
			)}
		</Box>
	);
};

export default CurrencyConverter;
