const { UserModel } = require('../db/Models'); // Importa o modelo do Mongoose
const { body, validationResult } = require('express-validator'); // Importa o body e validationResult do express-validator
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const escapeHtml = require('escape-html');

/**
 * Cria uma sessão para o usuário autenticado
 * 
 * @param {Object} req - Objeto de requisição contendo o corpo com email e senha do usuário
 * @param {Object} _res - Objeto de resposta (não utilizado)
 * @typedef {[boolean, Error]} Tuple - Representa um array onde o primeiro elemento é um booleano indicando se a autenticação foi bem-sucedida e o segundo é um erro se ocorrer
 * @returns {Tuple} - Retorna um array onde o primeiro elemento é um booleano indicando se a autenticação foi bem-sucedida e o segundo é um erro se ocorrer
 */
const createSession = async (req, _res) => {
    await body('email').isEmail().withMessage('E-mail inválido').run(req);
    await body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres').run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return [false, new Error('Validação falhou')];
    }

    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) return [false, new Error('Usuário não encontrado')];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return [false, new Error('Senha incorreta')];

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Coloca o token no session
        req.session.token = token;
        await req.session.save();

        return [token, null];
    } catch (error) {
        return [false, error];
    }
};

/**
 * Encerra a sessão do usuário autenticado
 * 
 * @param {Object} req - Objeto de requisição contendo a sessão do usuário
 * @param {Object} _res - Objeto de resposta (não utilizado)
 * @typedef {[boolean, Error]} Tuple - Representa um array onde o primeiro elemento é um booleano indicando se a operação foi bem-sucedida e o segundo é um erro se ocorrer
 * @returns {Tuple} - Retorna um array onde o primeiro elemento é um booleano indicando se a operação foi bem-sucedida e o segundo é um erro se ocorrer
 */
const logout = async (req, _res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                throw err;
            }
        });
        return [true, null];
    } catch (error) {
        return [false, error];
    }
};

/**
 * Obtém a sessão do usuário autenticado
 * 
 * @param {Object} req - Objeto de requisição contendo a sessão do usuário
 * @param {Object} _res - Objeto de resposta (não utilizado)
 * @typedef {[Object, Error]} Tuple - Representa um array onde o primeiro elemento é o ID do usuário e o segundo é um erro se ocorrer
 * @returns {Tuple} - Retorna um array onde o primeiro elemento é o ID do usuário e o segundo é um erro se ocorrer
 */
const getSession = async (req, _res) => {
    try {
        const token = req.session.token;
        if (token) {
            return [token, null];
        } else {
            return [null, null];
        }
    } catch (error) {
        return [null, error];
    }
};

/**
 * Cria um novo usuário no banco de dados
 * 
 * @param {Object} req - Objeto de requisição contendo o corpo com nome, email e senha do usuário
 * @param {Object} res - Objeto de resposta
 * @typedef {[Object, Error]} Tuple - Representa um array onde o primeiro elemento é o documento do usuário e o segundo é um erro se ocorrer
 * @returns {Tuple} - Retorna um array onde o primeiro elemento é o documento do usuário encontrado e o segundo é um erro se ocorrer
 */
const createUser = async (req, _res) => {
    await body('name').trim().notEmpty().withMessage('Nome é obrigatório').run(req);
    await body('email').isEmail().withMessage('E-mail inválido').run(req);
    await body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres').run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return [null, new Error('Validação falhou')];
    }

    const { name, email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return [null, new Error('E-mail já cadastrado')];

        const sanitizedUser = {
            name: escapeHtml(name.trim()),
            email: escapeHtml(email.trim()),
            password: await bcrypt.hash(password, 12)
        };

        const user = new UserModel(sanitizedUser);
        await user.save();

        // Cria a sessão para o novo usuário
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;
        await req.session.save();

        return [user, null];
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno', error: error.message });
    }
};

module.exports = {
    createSession,
    createUser,
    checkAuth
};
