const jwt = require('jsonwebtoken');
const redis = require('redis');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
require('dotenv').config();

// Configuração do Redis para blacklist de tokens revogados
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

// Configuração do logger para registrar eventos de autenticação
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'auth.log' })
    ]
});

// Rate limiter para prevenir ataques de força bruta
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo de 5 tentativas por IP
    message: 'Muitas tentativas de login. Tente novamente mais tarde.'
});

const AuthController = {
    async checkAuth(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader && !req.session.token) {
            logger.info('Tentativa de acesso sem token');
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const token = req.session.token || authHeader.replace('Bearer ', ''); // Verificar se o token está na sessão

        try {
            // Verificar se o token está na blacklist
            const isRevoked = await redisClient.get(`blacklist_${token}`);
            if (isRevoked) {
                logger.warn('Tentativa de uso de token revogado');
                return res.status(401).json({ message: 'Token inválido' });
            }

            // Verificar e decodificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (!decoded) {
                logger.warn('Tentativa de uso de token inválido');
                return res.status(401).json({ message: 'Token inválido' });
            }

            next();
        } catch (error) {
            logger.error('Erro na autenticação: ' + error.message);
            return res.status(401).json({ message: 'Token inválido' });
        }
    },

    async destroyToken(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({ message: 'Nenhum token fornecido' });
        }

        const token = authHeader.replace('Bearer ', '') || req.session.token; // Verificar se o token está na sessão

        try {
            await redisClient.set(`blacklist_${token}`, 'revoked', 'EX', 3600); // Expira em 1 hora
            req.session.destroy();
            logger.info(`Token adicionado à blacklist: ${token}`);
            res.status(200).json({ message: 'Logout realizado com sucesso' });
        } catch (error) {
            logger.error('Erro ao adicionar token à blacklist: ' + error.message);
            res.status(500).json({ message: 'Erro interno ao processar o logout' });
        }
    },

    loginLimiter
};

module.exports = AuthController;