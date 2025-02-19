const { UserModel } = require('../db/Models');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const escapeHtml = require('escape-html');

// Função para extrair o ID do usuário a partir do token
const getUserIdFromToken = (req) => {
    if (!req.session.token) return null;
    try {
        const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (error) {
        return null;
    }
};

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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;
        await req.session.save();
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => (err ? reject(err) : resolve()));
        });
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getSession = async (req, res) => {
    const token = req.session.token || null;
    return res.json({ token });
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;
        await req.session.save();

        return res.json({ user });
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