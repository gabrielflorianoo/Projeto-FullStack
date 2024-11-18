import React, { useState, useMemo, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, Button, Typography, CircularProgress } from '@mui/material';
import useLocalStorage from '../hooks/useLocalStorageData';
import currencyData from '../api/currencies.json';
import axios from 'axios';

const API_KEY = '09612e6a2ae12aa8c29017728fd7109e';

function saveToLocalStorage(variableName, dataToSave) {
	localStorage.setItem(variableName, JSON.stringify(dataToSave));
}

const CurrencyConverter = () => {
	const [amount, setAmount] = useState(1); // Quantia em EUR
	const [autoConverter, setAutoConverter] = useState(false);  // Ativar a conversão automática
	const [targetCurrency, setTargetCurrency] = useState(useLocalStorage('targetCurrency') || 'USD'); // Moeda de destino
	const [conversionRate, setConversionRate] = useState(useLocalStorage('conversionRate')); // Taxa de conversão
	const [result, setResult] = useState(null); // Resultado da conversão
	const [loading, setLoading] = useState(false); // Estado de carregamento

	const savedTargetCurrency = useLocalStorage('targetCurrency');

	useEffect(() => {
		if (savedTargetCurrency) {
			setTargetCurrency(savedTargetCurrency);
		}
	}, [savedTargetCurrency]);

	useEffect(() => {
		// Atualiza automaticamente a conversão quando `targetCurrency` ou `amount` muda
		// Mas o `amount` só deve ser considerado se `autoConverter` estiver ativado
		if (autoConverter || !autoConverter) {
			handleConvert();
		}
	}, [amount, targetCurrency, autoConverter]);	

	// Lista de moedas disponíveis, exceto EUR
	const currencyOptions = useMemo(
		() => currencyData.currencies.filter((currency) => currency !== 'EUR'),
		[]
	);

	// Função para converter moedas
	const handleConvert = async () => {
		setLoading(true); // Inicia o estado de carregamento

		// Apenas chama a api se não tiver dados salvos no localStorage e tentar converter a mesma moeda
		if (conversionRate !== null && savedTargetCurrency === targetCurrency) {
			setResult(parseFloat(amount * conversionRate));
		} else {
			try {
				// const response = await convertCoin(targetCurrency);
				const response = await axios.get(`https://data.fixer.io/api/latest?access_key=${API_KEY}`,
					{
						params: {
							base: 'EUR',
							symbols: targetCurrency,
						}
					}
				);

				const rate = response.data.rates[targetCurrency]; // Obtém a taxa de conversão
				
				setConversionRate(rate); // Atualiza o estado da taxa
				setResult((amount * rate).toFixed(2)); // Calcula o valor convertido

				// Salva os dados no armazenamento local
				saveToLocalStorage('conversionRate', rate);
				saveToLocalStorage('targetCurrency', targetCurrency);
			} catch (error) {
				console.error('Erro ao buscar taxa de conversão:', error);
			} finally {
				setLoading(false); // Finaliza o estado de carregamento
			}
		}

		setLoading(false); // Finaliza o estado de carregamento
	};

	return (
		<Box textAlign="center">
			<Button
				variant="contained"
				color={autoConverter ? 'error' : 'primary'}
				onClick={() => setAutoConverter(!autoConverter)}
			>{autoConverter ? 'Parar Conversão Automática' : 'Iniciar Conversão Automática'}
			</Button>
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
					Taxa de Conversão: 1 EUR = {conversionRate.toFixed(2)} {targetCurrency}
				</Typography>
			)}
			{result && (
				<Typography variant="h6" mt={2}>
					{result ? `${autoConverter ? amount : amount / amount} EUR = ${result ? parseFloat(result).toFixed(2) + ' ' + targetCurrency : '????'}` : 'Sem valor para converter'}
				</Typography>
			)}
		</Box>
	);
};

export default CurrencyConverter;