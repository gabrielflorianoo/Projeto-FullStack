const { Router } = require('express');
const {
	createUser,
	logIn,
	createSession,
	findUser,
	getAllUsers,
} = require('../controllers/UserCotroller.js');

const router = Router();

router.post('/', createUser, (req, res) => {
	res.status(201).json({ message: 'Usuario registrado com sucesso' });
});

router.post('/login', logIn, (req, res) => {
	createSession(req, res);
	res.status(200).json({ message: 'Login efetuado com sucesso' });
});

router.get('/', (req, res) => {
	res.json(getAllUsers());
});

router.get('/:id', (req, res) => {
	const user = findUser(req, res);
	res.json(user);
});

module.exports = router;
