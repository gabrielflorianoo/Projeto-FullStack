const { Router } = require('express');
const {
    createUser,
    logIn,
    createSession,
    findUser,
    getAllUsers,
} = require('../controllers/UserController.js');

const router = Router();

router.post('/', (_req, res) => {
    const [user, error] = createUser(_req, res);
    if (error) return res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    res.status(201).json(user);
});

router.post('/login', logIn, async (req, res) => {
    const [success, error] = await createSession(req, res);
    if (error) res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
    if (!success) res.status(401).json({ message: 'Email ou senha inválidos' });
    res.status(200).json({ message: 'Login efetuado com sucesso' });
});

router.get('/', async (_req, res) => {
    const [users, error] = await getAllUsers();
    if (error) return res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    res.json(users);
});

router.get('/:id', (req, res) => {
    const [user, error] = findUser(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
});

module.exports = router;
