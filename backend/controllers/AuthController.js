const jwt = require('jsonwebtoken');
const redis = require('redis');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
require('dotenv').config();

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'auth.log' })
    ]
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { error: 'Muitas tentativas de login. Tente novamente mais tarde.' }
});

class AuthController {
    static async authenticate(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            logger.info('Tentativa de acesso sem token');
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const isRevoked = await redisClient.get(`blacklist_${token}`);
            if (isRevoked) {
                logger.warn('Tentativa de uso de token revogado');
                return res.status(401).json({ error: 'Token inválido' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            logger.error('Erro na autenticação: ' + error.message);
            return res.status(401).json({ error: 'Token inválido' });
        }
    }

    static async logout(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({ error: 'Nenhum token fornecido' });
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            await redisClient.set(`blacklist_${token}`, 'revoked', 'EX', 3600);
            logger.info(`Token adicionado à blacklist: ${token}`);
            res.status(200).json({ message: 'Logout realizado com sucesso' });
        } catch (error) {
            logger.error('Erro ao adicionar token à blacklist: ' + error.message);
            res.status(500).json({ error: 'Erro interno ao processar o logout' });
        }
    }
}

module.exports = { AuthController, loginLimiter };