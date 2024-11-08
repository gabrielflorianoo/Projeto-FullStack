import React, { useState, useEffect } from 'react';
import './App.css';
import callApi from './api/server';

function App() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if data is already in local storage
        let dataFromStorage = localStorage.getItem('data');

        if (dataFromStorage) {
            // Parse and set data from local storage
            setData(JSON.parse(dataFromStorage));
        } else {
            // Call the API if no data is in local storage
            callApi()
                .then((response) => {
                    setData(response);
                    localStorage.setItem('data', JSON.stringify(response));
                })
                .catch((err) => {
                    console.error(err);
                    setError('Unable to fetch the data');
                });
        }
    }, []);

    return (
        <div className="App">
            {error ? (
                <p>{error}</p>
            ) : data ? (
                <p>
                    1 {data.base} is equal to {data.rates.USD} INR on Today
                </p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default App;
