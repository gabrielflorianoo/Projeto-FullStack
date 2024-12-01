const express = require('express');
const router = express.Router();

const { createConverter, getConverterInPeriod, getAllConverter } = require('../controllers/ConvertorController.js');
const AuthController = require('../controllers/AuthController.js');

router.get('/:id', AuthController.checkAuth, async (req, res) => {
    const [converters, error] = await getConverterInPeriod(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar historico de conversão', error: error.message });
    if (converters.length == 0) return res.status(404).json({ message: 'Nenhuma conversão encontrada' });
    res.json(converters);
});

router.get('/', AuthController.checkAuth, async (req, res) => {
    const [converters, error] = await getAllConverter(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar historico de conversão', error: error.message });
    if (converters.length == 0) return res.status(404).json({ message: 'Nenhuma conversão encontrada' });
    res.json(converters);
});

router.post('/', AuthController.checkAuth, async (req, res) => {
    const [success, error] = createConverter(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao criar historico de conversão', error: error.message });
    if (!success) return res.status(500).json({ message: 'Erro ao adicionar conversão ao historico' });
    res.status(201).json({ message: 'Historico de conversão criado com sucesso' });
});

module.exports = router;
