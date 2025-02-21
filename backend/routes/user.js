const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController.js');
const requestLimiter = require('express-rate-limit');   // Limita o número de requisições por IP

let createUserLimiter = (req, res, next) => next();
let createSessionLimiter = (req, res, next) => next();

if (process.env.NODE_ENV === 'production') {
    createUserLimiter = requestLimiter({
        windowMs: 15 * 60 * 1000,  // 15 minutos
        max: 3,                    // Limitar para 3 tentativas
        message: { error: 'Muitas tentativas de criação de usuário. Tente novamente mais tarde.' },
    });

    createSessionLimiter = requestLimiter({
        windowMs: 15 * 60 * 1000,  // 15 minutos
        max: 5,                    // Limitar para 5 tentativas
        message: { error: 'Muitas tentativas de login. Tente novamente mais tarde.' },
    });
}

router.post('/', createUserLimiter, async (req, res) => {
    try {
        await UserController.createUser(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
});

router.post('/login', createSessionLimiter, async (req, res) => {
    try {
        await UserController.createSession(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
    }
});

router.post('/logout', async (req, res) => {
    try {
        await UserController.logout(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deslogar', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        await UserController.getAllUsers(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
});

router.get('/sessions', async (req, res) => {
    try {
        await UserController.getSession(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar sessão', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        await UserController.findUser(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await UserController.deleteUser(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
    }
});

module.exports = router;