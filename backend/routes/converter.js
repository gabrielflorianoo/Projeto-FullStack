const express = require('express');
const router = express.Router();

const { createConverter, getConverterInPeriod } = require('../controllers/ConvertorController.js');
const AuthController = require('../controllers/AuthController.js');

router.get('/:id', AuthController.checkAuth, async (req, res) => {
    // TODO - Pega os dados do usuário com ID x
});

router.get('/', AuthController.checkAuth, async (req, res) => {
    // TODO - Pega os dados do usuário com ID x
});

router.post('/', AuthController.checkAuth, async (req, res) => {
    const [success, error] = createConverter(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao criar historico de conversão', error: error.message });
    if (!success) return res.status(500).json({ message: 'Erro ao adicionar conversão ao historico' });
    res.status(201).json({ message: 'Historico de conversão criado com sucesso' });
});

module.exports = router;
