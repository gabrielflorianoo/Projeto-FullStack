import axios from 'axios';

const API_KEY = 'dcc4215d48948f04f6e7dfc58baae0af';

const options = {
    method: 'GET',
    url: `https://data.fixer.io/api/latest?access_key=${API_KEY}`,
    params: {
        base: 'EUR',
        symbols: 'USD',
    },
};

async function callApi() {
    try {
        const response = await axios(options);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export default callApi;
