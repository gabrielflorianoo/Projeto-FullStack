import { Button, TextField, MenuItem, Select } from '@mui/material';
import useLocalStorage from './hooks/useLocalStorageData'; // Custom hook
import React, { useState, useEffect } from 'react';
import currencyData from './api/currencies.json';
import convertCoin from './api/converter';
import './App.css';

/**
 * Salva um dado no armazenamento local do navegador.
 * @param {string} variableName - Nome da variável a ser salva.
 * @param {any} dataToSave - Dado a ser salvo.
 */
function saveToLocalStorage(variableName, dataToSave) {
    localStorage.setItem(variableName, JSON.stringify(dataToSave));
}

function App() {
    const [amount, setAmount] = useState(1);
    const [result, setResult] = useState(0);
    const conversionRate = useLocalStorage('conversionRate');
    const savedTargetCurrency = useLocalStorage('targetCurrency');
    const [targetCurrency, setTargetCurrency] = useState('USD'); // Moeda alvo padrão

    // Seta a moeda alvo quando houver dados no armazenamento local
    useEffect(() => {
        if (savedTargetCurrency) {
            setTargetCurrency(savedTargetCurrency);
        }
    }, [savedTargetCurrency]);

    /**
     * Função para converter o valor em EUR(unica conversão disponível na versão gratuita da api) para a moeda alvo.
     * Caso haja dados no armazenamento local, utiliza a taxa de conversao
     * salva. Caso contrario, chama a API para obter a taxa de conversao
     * mais recente.
     * @async
     * @function
     */
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
                <TextField
                    label="Valor em EUR"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <Select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    label="Moeda"
                >
                    {currencyData.currencies.map((currency) => {
                        if (currency !== 'EUR') {
                            return (
                                <MenuItem key={currency} value={currency}>
                                    {currency}
                                </MenuItem>
                            );
                        }
                    })}
                </Select>
            </div>
            <Button variant="contained" onClick={handleConvert}>
                Converter
            </Button>
            <p>
                {result !== 0 || conversionRate !== null
                    ? `Valor em ${targetCurrency}: ${result.toFixed(2)}`
                    : 'Sem valor'}
            </p>
        </div>
    );
}

export default App;
