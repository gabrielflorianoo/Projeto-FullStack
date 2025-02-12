const { Router } = require('express');
const {
    createSession,
    getAllUsers,
    createUser,
    deleteUser,
    getSession,
    findUser,
    logout,
} = require('../controllers/UserController.js');
const { destroyToken } = require('../controllers/AuthController.js');

const router = Router();

router.post('/', async (req, res) => {
    const [user, error] = await createUser(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    res.status(201).json(user);
});

router.post('/login', async (req, res) => {
    const [userId, error] = await createSession(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
    if (!userId) return res.status(401).json({ message: 'Usuário não existente' });
    res.status(200).json({ userId });
});

router.post('/logout', async (req, res) => {
    const [success, error] = await logout(req, res);
    const [_, destroyError] = await destroyToken(req, res);
    if (error || destroyError) return res.status(500).json({ message: 'Erro ao deslogar', error: error.message });
    if (!success) return res.status(401).json({ message: 'Usuário não autenticado' });
    res.status(200).json({ message: 'Logout efetuado com sucesso' });
});

router.get('/', async (_req, res) => {
    const [users, error] = await getAllUsers();
    if (error) return res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    res.json(users);
});

router.get('/session', async (req, res) => {
    const [session, error] = await getSession(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar sessão', error: error.message });
    if (!session) return res.status(404).json({ message: 'Sessão não encontrada' });
    res.json(session);
});

router.get('/:id', async (req, res) => {
    const [user, error] = await findUser(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
});

router.delete('/:id', async (req, res) => {
    const [user, error] = await deleteUser(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
    if (!user) return res.status(404).json({ message: 'Usuário nao encontrado' });
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
});

module.exports = router;
