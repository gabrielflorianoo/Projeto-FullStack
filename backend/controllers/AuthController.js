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
        const token = req.headers.authorization;
        if (!token) {
            logger.info('Tentativa de acesso sem token');
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        try {
            // Verificar se o token está na blacklist
            const isRevoked = await redisClient.get(`blacklist_${token}`);
            if (isRevoked) {
                logger.warn('Tentativa de uso de token revogado');
                return res.status(401).json({ message: 'Token inválido' });
            }

            // Verificar e decodificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            next();
        } catch (error) {
            logger.error('Erro na autenticação: ' + error.message);
            return res.status(401).json({ message: 'Token inválido' });
        }
    },

    async logout(req, res) {
        const token = req.headers.authorization;
        if (token) {
            await redisClient.set(`blacklist_${token}`, 'revoked', 'EX', 3600); // Expira em 1 hora
        }
        res.status(200).json({ message: 'Logout realizado com sucesso' });
    }
};

module.exports = { AuthController, loginLimiter };
