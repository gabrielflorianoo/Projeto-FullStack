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
    const converters = await getConverterInPeriod(req.body);
    if (!converters) return res.status(500).json({ message: 'Erro ao buscar histórico de conversão' });
    if (converters.length === 0) return res.status(404).json({ message: 'Nenhuma conversão encontrada' });
    res.json(converters);
});

router.post('/byCurrency', AuthController.checkAuth, validateRequest, async (req, res) => {
    const converters = await getConverterByCurrency(req.body);
    if (!converters) return res.status(500).json({ message: 'Erro ao buscar histórico de conversão' });
    if (converters.length === 0) return res.status(404).json({ message: 'Nenhuma conversão encontrada' });
    res.json(converters);
});

router.post('/byExchangeRate', AuthController.checkAuth, validateRequest, async (req, res) => {
    const converters = await getConverterByExchangeRate(req.body);
    if (!converters) return res.status(500).json({ message: 'Erro ao buscar histórico de conversão' });
    if (converters.length === 0) return res.status(404).json({ message: 'Nenhuma conversão encontrada' });
    res.json(converters);
});

router.get('/', AuthController.checkAuth, async (req, res) => {
    const converters = await getAllConverter();
    if (!converters) return res.status(500).json({ message: 'Erro ao buscar histórico de conversão' });
    res.json(converters);
});

router.post('/', AuthController.checkAuth, validateRequest, async (req, res) => {
    const success = await createConverter(req.body);
    if (!success) return res.status(500).json({ message: 'Erro ao adicionar conversão ao histórico' });
    res.status(201).json({ message: 'Histórico de conversão criado com sucesso' });
});

router.delete('/:id', AuthController.checkAuth, async (req, res) => {
    const success = await deleteConverter(req.params.id);
    if (!success) return res.status(404).json({ message: 'Conversão não encontrada' });
    res.json({ message: 'Histórico de conversão deletado com sucesso' });
});

module.exports = router;