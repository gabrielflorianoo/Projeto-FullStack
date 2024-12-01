const { UserModel } = require('../db/Models'); // Importa o modelo do Mongoose

const createSession = async (req, _res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email, password });
        if (user) {
            req.session.userId = user._id;
            return [true, null]; // Return an array as expected
        } else {
            return [false, null];
        }
    } catch (error) {
        return [null, error]; // Ensure it's an array
    }
};

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Cria um novo documento de usuário no banco de dados
        const user = new UserModel({ name, email, password });
        await user.save(); // Salva o usuário no banco
        return [user, null];
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error });
        return [null, error];
    }
};

const logIn = async (req, _res, next) => {
    const { email, password } = req.body;

    try {
        // Busca o usuário pelo email e senha
        const user = await UserModel.findOne({ email, password });
        if (user) {
            req.session.userId = user._id; // Salva o ID do usuário na sessão
            next();
        }
    } catch (error) {
        console.error(error);
    }
};

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

const getAllUsers = async () => {
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
