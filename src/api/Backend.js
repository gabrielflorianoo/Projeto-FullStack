import axios from 'axios';

const api = axios.create({
    baseURL: 'https://projeto-full-stack-nine.vercel.app', // URL base do backend
    // baseURL: 'http://localhost:8000', // URL base do backend para testes
    withCredentials: true, // Permite enviar cookies com as requisições
});

// Função genérica para lidar com requisições
const handleRequest = async (callback) => {
    try {
        const response = await callback();
        return response.data;
    } catch (error) {
        console.error('Erro na requisição:', error.response?.data || error.message);
        throw error;
    }
};

// Usuários
export const createUser = (userData) => handleRequest(() => api.post('/users', userData));
export const loginUser = (credentials) => handleRequest(() => api.post('/users/login', credentials));
export const getAllUsers = () => handleRequest(() => api.get('/users'));
export const getUserById = (userId) => handleRequest(() => api.get(`/users/${userId}`));
export const deleteUserById = (userId) => handleRequest(() => api.delete(`/users/${userId}`));
export const getSession = () => handleRequest(() => api.get('/users/sessions'));
export const logoutUser = () => handleRequest(() => api.post('/users/logout'));

// Conversões
export const createConversion = (conversionData) => handleRequest(() => api.post('/convertions', conversionData));
export const getAllConversions = () => handleRequest(() => api.get('/convertions'));
export const deleteConversion = (conversionId) => handleRequest(() => api.delete(`/convertions/${conversionId}`));
export const getConverterInPeriod = (date) => handleRequest(() => api.post('/convertions/byPeriod', { date }));
export const getConverterByCurrency = (currency) => handleRequest(() => api.post('/convertions/byCurrency', { currency }));
export const getConverterByExchangeRate = (exchangeRate) => handleRequest(() => api.post('/convertions/byExchangeRate', { exchangeRate }));