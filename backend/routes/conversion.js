const express = require('express');
const router = express.Router();
const ConversionController = require('../controllers/ConversionController.js');
const AuthController = require('../controllers/AuthController.js');

const handleRequest = async (res, controllerMethod, successMessage) => {
    try {
        const [result, error] = await controllerMethod;
        if (error) {
            if (!res.headersSent) {
                return res.status(500).json({ message: 'Erro no processamento', error: error.message });
            }
        }
        if (!result || result.length === 0) {
            if (!res.headersSent) {
                return res.status(404).json({ message: 'Nenhum dado encontrado' });
            }
        }
        if (!res.headersSent) {
            return res.status(successMessage ? 201 : 200).json(successMessage ? { message: successMessage } : result);
        }
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ message: 'Erro interno', error: err.message });
        }
    }
};

router.use(AuthController.authenticate);

router.post('/byPeriod', (req, res) => handleRequest(res, ConversionController.getConverterInPeriod(req, res)));
router.post('/byCurrency', (req, res) => handleRequest(res, ConversionController.getConverterByCurrency(req, res)));
router.post('/byExchangeRate', (req, res) => handleRequest(res, ConversionController.getConverterByExchangeRate(req, res)));
router.get('/', (req, res) => handleRequest(res, ConversionController.getAllConverters(req, res)));
router.post('/', (req, res) => handleRequest(res, ConversionController.createConverter(req, res), 'Histórico de conversão criado com sucesso'));
router.delete('/:id', (req, res) => handleRequest(res, ConversionController.deleteConverter(req, res), 'Histórico de conversão deletado com sucesso'));

module.exports = router;