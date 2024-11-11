import { Button, TextField, MenuItem, Select } from '@mui/material';
import useLocalStorage from './hooks/useLocalStorageData';
import React, { useState, useEffect, useMemo } from 'react';
import currencyData from './api/currencies.json';
import convertCoin from './api/converter';
import './App.css';

function saveToLocalStorage(variableName, dataToSave) {
    localStorage.setItem(variableName, JSON.stringify(dataToSave));
}

function App() {
    const [amount, setAmount] = useState(1);
    const [result, setResult] = useState(0);
    const [autoConverter, setAutoConverter] = useState(false);
    const conversionRate = parseFloat(useLocalStorage('conversionRate'));
    const savedTargetCurrency = useLocalStorage('targetCurrency');
    const [targetCurrency, setTargetCurrency] = useState('USD');

    // Cria um array com todas as moedas, exceto a EUR usando memorização
    const currencyOptions = useMemo(
        () => currencyData.currencies.filter((currency) => currency !== 'EUR'),
        []
    );

    useEffect(() => {
        if (savedTargetCurrency) {
            setTargetCurrency(savedTargetCurrency);
        }
    }, [savedTargetCurrency]);

    useEffect(() => {
        // Atualiza automaticamente a conversão quando `targetCurrency` muda
        // Ou quando o `amount` mudar, mas apenas se `autoConverter` estiver ativado
        handleConvert();
    }, [autoConverter ? amount : targetCurrency]);

    const handleConvert = async () => {
        if (conversionRate !== null && savedTargetCurrency === targetCurrency) {
            setResult(parseFloat(amount * conversionRate));
        } else {
            try {
                const response = await convertCoin(targetCurrency);
                const rate = response.rates[targetCurrency];

                setResult(amount * rate);
                saveToLocalStorage('conversionRate', rate);
                saveToLocalStorage('targetCurrency', targetCurrency);
            } catch (error) {
                console.error('Erro ao obter taxas de conversao:', error);
            }
        }
    };

    return (
        <div className="App">
            <div className="inputs">
                <Button
                    variant="contained"
                    color={autoConverter ? 'error' : 'primary'}
                    onClick={() => setAutoConverter(!autoConverter)}
                >
                    {autoConverter ? 'Parar Conversão Automática' : 'Iniciar Conversão Automática'}
                </Button>
                <div>
                    <TextField
                        label="Valor em EUR"
                        type="number"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value > -1 ? e.target.value : 0)
                        }
                    />
                    <Select
                        value={targetCurrency}
                        onChange={(e) => setTargetCurrency(e.target.value)}
                        label="Moeda"
                    >
                        {currencyOptions.map((currency) => (
                            <MenuItem key={currency} value={currency}>
                                {currency}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
            <div>
                <Button variant="contained" onClick={handleConvert}>
                    Converter
                </Button>
                <p>
                    {conversionRate !== null
                        ? `Taxa de Conversão: ${conversionRate.toFixed(2)}`
                        : 'Sem taxa de conversão'}
                </p>
            </div>
            <p>
                {result !== 0 || conversionRate !== null
                    ? `Valor em ${targetCurrency}: ${result.toFixed(2)}`
                    : 'Sem valor'}
            </p>
        </div>
    );
}

export default App;
