import useLocalStorage from './hooks/useLocalStorageData'; // Custom hook
import React, { useState } from 'react';
import './App.css';
import { Button, TextField, MenuItem, Select } from '@mui/material';
import currencyData from './api/currencies.json';

function App() {
    const [value, setValue] = useState(1); // Stores the input value in EUR
    const [currency, setCurrency] = useState('USD'); // Currency to convert to
    const [result, setResult] = useState(null);
    const data = useLocalStorage('data'); // Stores the last conversion in localStorage

    const handleConvert = async () => {
        // Call your API for conversion rates
        try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/EUR`);
            const exchangeData = await response.json();
            
            // Update localStorage with the new conversion data
            data.set({ base: 'EUR', rates: exchangeData.rates });
            
            // Calculate the converted amount and update the result state
            const convertedValue = value * exchangeData.rates[currency];
            setResult(convertedValue);
        } catch (error) {
            console.error('Error fetching conversion rates:', error);
        }
    };

    return (
        <div className="App">
            <TextField
                label="Valor em EUR"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                InputLabelProps={{ shrink: true }}
            />
            <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                label="Moeda"
            >
                {currencyData.currencies.map((curr) => (
                    <MenuItem key={curr} value={curr}>{curr}</MenuItem>
                ))}
            </Select>
            <Button variant="contained" onClick={handleConvert}>
                Converter
            </Button>
            <p>
                {result !== null
                    ? `Valor em ${currency}: ${result.toFixed(2)}`
                    : 'Sem valor'}
            </p>
        </div>
    );
}

export default App;
