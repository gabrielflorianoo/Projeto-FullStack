import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // URL base do backend
});

// Função para criar um novo usuário
export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};

// Função para fazer login
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/users/login', credentials);
        return response;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
};

// Função para buscar todos os usuários
export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
};

// Função para buscar um usuário pelo ID
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
};

// Função para deletar um usuário pelo ID
export const deleteUserById = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
    }
};

// Função para criar uma nova conversão
export const createConversion = async (conversionData) => {
    try {
        const response = await api.post('/converter', conversionData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar conversão:', error);
        throw error;
    }
};

// Função para obter a sessão do usuário
export const getSession = async () => {
    try {
        const response = await api.get('/users/session');
        return response.data;
    } catch (error) {
        console.error('Erro ao obter sessão:', error);
        throw error;
    }
};

// Função para buscar todas as conversões
export const getAllConversions = async () => {
    try {
        const response = await api.get('/converter');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar conversões:', error);
        throw error;
    }
};

// Função para buscar conversões por ID de usuário
export const getConversionsByUserId = async (userId) => {
    try {
        const response = await api.get(`/converter/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar conversões:', error);
        throw error;
    }
};

// Função para atualizar uma conversão
export const updateConversion = async (conversionId, conversionData) => {
    try {
        const response = await api.put(`/converter/${conversionId}`, conversionData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar conversão:', error);
        throw error;
    }
};

// Função para deletar uma conversão
export const deleteConversion = async (conversionId) => {
    try {
        const response = await api.delete(`/converter/${conversionId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar conversão:', error);
        throw error;
    }
};