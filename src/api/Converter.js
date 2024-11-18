import axios from 'axios';

const API_KEY = '09612e6a2ae12aa8c29017728fd7109e';

async function convertCoin(currency) {
    try {
        const response = await axios({
            method: 'GET',
            url: `https://data.fixer.io/api/latest?access_key=${API_KEY}`,
            params: {
                base: 'EUR',
                symbols: currency,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export default convertCoin;
