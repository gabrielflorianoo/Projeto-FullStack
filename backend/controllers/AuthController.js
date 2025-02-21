const jwt = require('jsonwebtoken');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'auth.log' })
    ]
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
}

module.exports = AuthController;