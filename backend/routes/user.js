const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserModel } = require('../db/Models');
const { body, validationResult } = require('express-validator');
const escapeHtml = require('escape-html');
const helmet = require('helmet');
const morgan = require('morgan');

// Controlador de autenticação
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

// Função para autenticar o usuário e criar uma sessão
const createSession = async (req, res) => {
    await body('email').isEmail().normalizeEmail().run(req);
    await body('password').isLength({ min: 6 }).trim().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Senha incorreta' });

        // Gerando token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno', error: error.message });
    }
};

// Função para criar um novo usuário
const createUser = async (req, res) => {
    await body('name').notEmpty().trim().escape().run(req);
    await body('email').isEmail().normalizeEmail().run(req);
    await body('password').isLength({ min: 6 }).trim().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'E-mail já cadastrado' });

        // Sanitização e criação do usuário
        const sanitizedUser = {
            name: escapeHtml(name.trim()),
            email: escapeHtml(email.trim()),
            password: await bcrypt.hash(password, 12)
        };

        const user = new UserModel(sanitizedUser);
        await user.save();

        return res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno', error: error.message });
    }
};

const express = require('express');
const app = express();

// Configuração de segurança
app.use(helmet()); // Proteção contra vulnerabilidades comuns
app.use(morgan('combined')); // Logs detalhados das requisições

module.exports = {
    createSession,
    createUser,
    checkAuth: AuthController.checkAuth,
    app
};
