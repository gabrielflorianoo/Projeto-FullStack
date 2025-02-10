const express = require('express');
const router = express.Router();

const { createConverter, getConverterInPeriod, getAllConverter, updateConverter, deleteConverter } = require('../controllers/ConvertorController.js');
const AuthController = require('../controllers/AuthController.js');

router.get('/:id', async (req, res) => {
    const [converters, error] = await getConverterInPeriod(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar historico de conversão', error: error.message });
    if (converters.length == 0) return res.status(404).json({ message: 'Nenhuma conversão encontrada' });
    res.json(converters);
});

router.get('/', async (req, res) => {
    const [converters, error] = await getAllConverter(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao buscar historico de conversão', error: error.message });
    if (converters.length == 0) return res.status(404).json({ message: 'Nenhuma conversão encontrada' });
    res.json(converters);
});

router.post('/', async (req, res) => {
    const [success, error] = await createConverter(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao criar historico de conversão', error: error.message });
    if (!success) return res.status(500).json({ message: 'Erro ao adicionar conversão ao historico' });
    res.status(201).json({ message: 'Historico de conversão criado com sucesso' });
});

router.put('/:id', async (req, res) => {
    const [success, error] = await updateConverter(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao atualizar historico de conversão', error: error.message });
    if (!success) return res.status(404).json({ message: 'Conversão não encontrada' });
    res.json({ message: 'Historico de conversão atualizado com sucesso' });
});

router.delete('/:id', async (req, res) => {
    const [success, error] = await deleteConverter(req, res);
    if (error) return res.status(500).json({ message: 'Erro ao deletar historico de conversão', error: error.message });
    if (!success) return res.status(404).json({ message: 'Conversão não encontrada' });
    res.json({ message: 'Historico de conversão deletado com sucesso' });
});

module.exports = router;