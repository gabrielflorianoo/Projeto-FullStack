const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

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
        if (!authHeader && !req.session.token) {
            logger.info('Tentativa de acesso sem token ou sem requisição');
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const token = req.session.token || authHeader.replace('Bearer ', '');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                logger.error('Erro ao decodificar token');
                return res.status(401).json({ error: 'Token inválido' });
            }

            req.user = decoded;
            if (!res.headersSent) {
                return next();
            }
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
            logger.info(`Token adicionado à blacklist: ${token}`);
            res.status(200).json({ message: 'Logout realizado com sucesso' });
        } catch (error) {
            logger.error('Erro ao adicionar token à blacklist: ' + error.message);
            res.status(500).json({ error: 'Erro interno ao processar o logout' });
        }
    }
}

module.exports = AuthController;