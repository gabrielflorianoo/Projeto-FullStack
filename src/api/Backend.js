import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://projeto-full-stack-nine.vercel.app', // URL base do backend
    baseURL: 'http://localhost:8000', // URL base do backend para testes
    withCredentials: true, // Permite enviar cookies com as requisições
});

// Função para criar um novo usuário
export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.log('Erro ao criar usuário:', error);
    }
};

// Função para fazer login
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/users/login', credentials);
        return response;
    } catch (error) {
        console.log('Erro ao fazer login:', error);
    }
};

// Função para buscar todos os usuários
export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.log('Erro ao buscar usuários:', error);
    }
};

// Função para buscar um usuário pelo ID
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.log('Erro ao buscar usuário:', error);
    }
};

// Função para deletar um usuário pelo ID
export const deleteUserById = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.log('Erro ao deletar usuário:', error);
    }
};

// Função para criar uma nova conversão
export const createConversion = async (conversionData) => {
    try {
        const response = await api.post('/converter', conversionData);
        return response.data;
    } catch (error) {
        console.log('Erro ao criar conversão:', error);
    }
};

// Função para obter a sessão do usuário
export const getSession = async () => {
    try {
        const response = await api.get('/users/session');
        return response.data;
    } catch (error) {
        console.log('Erro ao obter sessão:', error);
    }
};

export const logoutUser = async () => {
    try {
        const response = await api.post('/users/logout');
        return response;
    } catch (error) {
        console.log('Erro ao fazer logout:', error);
    }
}

// Função para buscar todas as conversões
export const getAllConversions = async () => {
    try {
        const response = await api.get('/converter');
        return response.data;
    } catch (error) {
        console.log('Erro ao buscar conversões:', error);
    }
};

// Função para buscar conversões por ID de usuário
export const getConverterInPeriod = async (data) => {
    try {
        const response = await api.post(`/converter/byPeriod`, data);
        return response.data;
    } catch (error) {
        console.log('Erro ao buscar conversões por período:', error);
    }
};

// Função para buscar conversões por moeda
export const getConverterByCurrency = async (currency) => {
    try {
        const response = await api.post('/converter/byCurrency', currency);
        return response.data;
    } catch (error) {
        console.log('Erro ao buscar conversões por moeda:', error);
    }
};

// Função para buscar conversões por taxa de câmbio
export const getConverterByExchangeRate = async (exchangeRate) => {
    try {
        const response = await api.post('/converter/byExchangeRate', exchangeRate);
        return response.data;
    } catch (error) {
        console.log('Erro ao buscar conversões por taxa de câmbio:', error);
    }
};

// Função para deletar uma conversão
export const deleteConversion = async (conversionId) => {
    try {
        const response = await api.delete(`/converter/${conversionId}`);
        return response.data;
    } catch (error) {
        console.log('Erro ao deletar conversão:', error);
    }
};