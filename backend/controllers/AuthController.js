const AuthController = {
    async checkAuth(req, res, next) {
        if (typeof req.session.userId === 'undefined') {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }
        next();
    },
};

module.exports = AuthController;