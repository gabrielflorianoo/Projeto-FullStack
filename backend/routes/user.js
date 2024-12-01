const { Router } = require('express');
const {
    createUser,
    logIn,
    createSession,
    findUser,
    getAllUsers,
} = require('../controllers/UserCotroller.js');

const router = Router();

router.post('/', createUser, (_req, res) => {
    res.status(201).json({ message: 'Usuario registrado com sucesso' });
});

router.post('/login', logIn, (req, res) => {
    const [success, error] = createSession(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
    if (!success) return res.status(401).json({ message: 'Email ou senha inválidos' });
    res.status(200).json({ message: 'Login efetuado com sucesso' });
});

router.get('/', async (req, res) => {
    const [users, error] = await getAllUsers(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    res.json(users);
});

router.get('/:id', (req, res) => {
    const user = findUser(req, res);
    res.json(user);
});

module.exports = router;
