const jwt = require('jsonwebtoken');

const AuthController = {
    async checkAuth(req, res, next) {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido' });
        }
    },
};

module.exports = AuthController;
