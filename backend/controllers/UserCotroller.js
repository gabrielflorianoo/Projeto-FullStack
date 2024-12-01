/**
 * Tipo usuario
 *
 * @typedef {Object} User
 * @property {string} id - Identificador unico do usuario
 * @property {string} name - Nome do usuario
 * @property {string} email - E-mail do usuario
 * @property {string} password - Senha do usuario
 */

/**
 * Array de usuarios
 *
 * @type {Array<User>}
 */
const users = [];

const createSession = (req, res) => {
	const { email, password } = req.body;
	const user = users.find(
		(u) => u.email === email && u.password === password
	);
	if (user) {
		req.session.userId = user.id;
		res.status(200).json({ message: 'Login efetuado com sucesso' });
	} else {
		res.status(401).json({ message: 'Email ou senha invalidos' });
	}
};

const createUser = (req, res, next) => {
	const { name, email, password } = req.body;
	const user = { id: users.length + 1, name, email, password };
	users.push(user);
	res.status(201).json({ message: 'Usuario registrado com sucesso' });
};

const logIn = (req, res, next) => {
	const { email, password } = req.body;
	const user = users.find(
		(u) => u.email === email && u.password === password
	);
	if (user) {
		req.session.userId = user.id;
		res.status(200).json({ message: 'Login efetuado com sucesso' });
		next();
	} else {
		res.status(401).json({ message: 'Email ou senha invalidos' });
	}
};

const findUser = (req, res, next) => {
	const userId = parseInt(req.params.id, 10);
	const user = users.find((u) => u.id === userId);
	if (user) {
		return user;
	} else {
		res.status(404).json({ message: 'Usuario nao encontrado' });
		return null;
	}
};

const getAllUsers = () => {
	return users;
};

module.exports = {
	createSession,
	getAllUsers,
	createUser,
	findUser,
	logIn,
};
