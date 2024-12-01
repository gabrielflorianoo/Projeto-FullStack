const { UserModel } = require('../db/Models'); // Importa o modelo do Mongoose

const createSession = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Encontra o usuário no banco de dados
        const user = await UserModel.findOne({ email, password });
        if (user) {
            req.session.userId = user._id; // Armazena o ID do usuário na sessão
            return [true, null];
        } else {
            return [false, null];
        }
    } catch (error) {
        return [null, error];
    }
};

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Cria um novo documento de usuário no banco de dados
        const user = new UserModel({ name, email, password });
        await user.save(); // Salva o usuário no banco
        res.status(201).json({ message: 'Usuário registrado com sucesso', user });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
};

const logIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Busca o usuário pelo email e senha
        const user = await UserModel.findOne({ email, password });
        if (user) {
            req.session.userId = user._id; // Salva o ID do usuário na sessão
            res.status(200).json({ message: 'Login efetuado com sucesso' });
            next();
        } else {
            res.status(401).json({ message: 'Email ou senha inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login', error });
    }
};

const findUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Busca o usuário pelo ID no banco de dados
        const user = await UserModel.findById(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Busca todos os usuários no banco de dados
        const users = await UserModel.find({});
        return [users, null];
    } catch (error) {
        return [null, error];
    }
};

module.exports = {
    createSession,
    getAllUsers,
    createUser,
    findUser,
    logIn,
};
