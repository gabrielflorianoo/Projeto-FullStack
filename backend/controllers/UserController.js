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

        return [user, null];
    } catch (error) {
        return [null, error];
    }
};

/**
 * Busca um usuário pelo ID no banco de dados
 * 
 * @param {Object} req - Objeto de requisição contendo o parâmetro de ID do usuário
 * @param {Object} _res - Objeto de resposta (não utilizado)
 * @typedef {[Object, Error]} Tuple - Representa um array onde o primeiro elemento é o documento do usuário encontrado e o segundo é um erro se ocorrer
 * @returns {Tuple} - Retorna um array onde o primeiro elemento é o documento do usuário encontrado e o segundo é um erro se ocorrer
*/
const findUser = async (req, _res) => {
    const userId = req.params.id;

    try {
        // Busca o usuário pelo ID no banco de dados
        const user = await UserModel.findById(userId);
        return [user, null];
    } catch (error) {
        return [null, error];
    }
};

/**
 * Busca todos os usuários no banco de dados
 * 
 * @typedef {[Array, Error]} Tuple - Representa um array onde o primeiro elemento é um array de documentos de usuários e o segundo é um erro se ocorrer
 * @returns {Tuple} - Retorna um array onde o primeiro elemento é um array de documentos de usuários encontrados e o segundo é um erro se ocorrer
 */
const getAllUsers = async () => {
    try {
        // Busca todos os usuários no banco de dados
        const users = await UserModel.find({});
        return [users, null];
    } catch (error) {
        return [null, error];
    }
};

/**
 * Deleta um usuário pelo ID no banco de dados
 * 
 * @param {Object} req - Objeto de requisição contendo o parâmetro de ID do usuário
 * @param {Object} _res - Objeto de resposta (não utilizado)
 * @typedef {[Object, Error]} Tuple - Representa um array onde o primeiro elemento é o documento do usuário removido e o segundo é um erro se ocorrer
 * @returns {Tuple} - Retorna um array onde o primeiro elemento é o documento do usuário removido e o segundo é um erro se ocorrer
 */
const deleteUser = async (req, res) => {
    try {
        const [user, error] = await findUser(req, res);

        if (error) throw Error('Erro ao buscar usuário');
        if (!user) throw Error('Usuário nao encontrado');

        await UserModel.findByIdAndDelete(user._id);
        return [user, null];
    } catch (error) {
        return [null, error];
    }
};

module.exports = {
    createSession,
    getAllUsers,
    getSession,
    deleteUser,
    createUser,
    findUser,
    logout,
};
