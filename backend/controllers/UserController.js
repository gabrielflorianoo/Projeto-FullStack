const { UserModel } = require('../db/Models'); // Importa o modelo do Mongoose

/**
 * Cria uma sessão para o usuário autenticado
 * 
 * @param {Object} req - Objeto de requisição contendo o corpo com email e senha do usuário
 * @param {Object} _res - Objeto de resposta (não utilizado)
 * @typedef {[boolean, Error]} Tuple - Representa um array onde o primeiro elemento é um booleano indicando se a autenticação foi bem-sucedida e o segundo é um erro se ocorrer
 * @returns {Tuple} - Retorna um array onde o primeiro elemento é um booleano indicando se a autenticação foi bem-sucedida e o segundo é um erro se ocorrer
 */
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

/**
 * Cria um novo usuário no banco de dados
 * 
 * @param {Object} req - Objeto de requisição contendo o corpo com nome, email e senha do usuário
 * @param {Object} res - Objeto de resposta
 * @typedef {[Object, Error]} Tuple - Representa um array onde o primeiro elemento é o documento do usuário e o segundo é um erro se ocorrer
 * @returns {Tuple} - Retorna um array onde o primeiro elemento é o documento do usuário encontrado e o segundo é um erro se ocorrer
 */
const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Cria um novo documento de usuário no banco de dados
        const user = new UserModel({ name, email, password });
        await user.save(); // Salva o usuário no banco
        return [user, null];
    } catch (error) {
        return [null, error];
    }
};

/**
 * Autentica o usuário e salva o ID na sessão
 * 
 * @param {Object} req - Objeto de requisição contendo o corpo com email e senha do usuário
 * @param {Object} _res - Objeto de resposta (não utilizado)
 * @param {Function} next - Função de callback para prosseguir com a execução
 */
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
    deleteUser,
    createUser,
    findUser,
    logIn,
};
