const { UserModel, SessionModel } = require('../db/Models');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const escapeHtml = require('escape-html');

const createSession = async (req, res) => {
    await body('email').isEmail().run(req);
    await body('password').isLength({ min: 6 }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validação falhou' });

    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;
        
        // Salva o token da sessão no MongoDB
        const sessionData = {
            _id: `${req.session.id}`,
            token: req.session.token,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // Expira em 3 horas
        };

        const session = new SessionModel(sessionData);
        await session.save();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ token: decoded });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        await SessionModel.findByIdAndDelete(req.session.id);
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => (err ? reject(err) : resolve()));
        });

        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getSession = async (req, res) => {
    try {
        const session = await SessionModel.findById(req.session.id);

        console.log("Token: ", session.token); // Agora deve funcionar

        if (session) {
            if (session.expires > Date.now()) {
                const decoded = jwt.verify(session.token, process.env.JWT_SECRET);
                return res.json({ token: decoded });
            } else {
                // Deleta a sessão já expirada
                await SessionModel.findByIdAndDelete(req.session.id);
                return res.status(401).json({ error: 'Sessão expirada' });
            }
        }

        return res.status(201).json({ error: 'Sessão não encontrada' });
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

const createUser = async (req, res) => {
    await body('name').trim().notEmpty().run(req);
    await body('email').isEmail().run(req);
    await body('password').isLength({ min: 6 }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validação falhou' });

    const { name, email, password } = req.body;
    try {
        if (await UserModel.findOne({ email })) {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }

        const user = new UserModel({
            name: escapeHtml(name.trim()),
            email: escapeHtml(email.trim()),
            password: await bcrypt.hash(password, 12)
        });
        await user.save();

        const token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;
        
        // Salva o token da sessão no MongoDB
        const sessionData = {
            _id: `${req.session.id}`,
            token: req.session.token,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // Expira em 3 horas
        };

        const session = new SessionModel(sessionData);
        await session.save();

        const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
        return res.json({ token: decoded });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const findUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        return res.json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        return res.json({ users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        return res.json({ success: true, deletedUser: user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSession,
    getSession,
    logout,
    createUser,
    findUser,
    getAllUsers,
    deleteUser,
};