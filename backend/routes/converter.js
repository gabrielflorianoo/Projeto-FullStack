const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { createConverter,
    getConverterInPeriod,
    getAllConverter,
    deleteConverter,
    getConverterByCurrency,
    getConverterByExchangeRate,
} = require('../controllers/ConvertorController.js');
const AuthController = require('../controllers/AuthController.js');

// Middleware de validação de entrada
const validateRequest = [
    body('*').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

router.post('/byPeriod', AuthController.checkAuth, validateRequest, async (req, res) => {
    const [converters, error] = await getConverterInPeriod(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar histórico de conversão', error: error.message });
    if (converters.length === 0) return res.status(404).json({ message: 'Nenhuma conversão encontrada' });
    res.json(converters);
});

router.post('/byCurrency', AuthController.checkAuth, validateRequest, async (req, res) => {
    const [converters, error] = await getConverterByCurrency(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar histórico de conversão', error: error.message });
    if (converters.length === 0) return res.status(404).json({ message: 'Nenhuma conversão encontrada' });
    res.json(converters);
});

router.post('/byExchangeRate', AuthController.checkAuth, validateRequest, async (req, res) => {
    const [converters, error] = await getConverterByExchangeRate(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar histórico de conversão', error: error.message });
    if (converters.length === 0) return res.status(404).json({ message: 'Nenhuma conversão encontrada' });
    res.json(converters);
});

router.get('/', AuthController.checkAuth, async (req, res) => {
    const [converters, error] = await getAllConverter(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar histórico de conversão', error: error.message });
    res.json(converters);
});

router.post('/', AuthController.checkAuth, validateRequest, async (req, res) => {
    const [success, error] = await createConverter(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao criar histórico de conversão', error: error.message });
    if (!success) return res.status(500).json({ message: 'Erro ao adicionar conversão ao histórico' });
    res.status(201).json({ message: 'Histórico de conversão criado com sucesso' });
});

router.delete('/:id', AuthController.checkAuth, async (req, res) => {
    const [success, error] = await deleteConverter(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao deletar histórico de conversão', error: error.message });
    if (!success) return res.status(404).json({ message: 'Conversão não encontrada' });
    res.json({ message: 'Histórico de conversão deletado com sucesso' });
});

module.exports = router;
