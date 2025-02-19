const { CurrencyConverterModel, UserModel } = require('../db/Models');
const jwt = require('jsonwebtoken');

// Função para criar um novo conversor
const createConverter = async (req, _res) => {
    const { targetCurrency, exchangeRate, amountUsed } = req.body;

    if (!req.session.userId) return [false, "Usuário não autenticado."];
    if (!targetCurrency || !exchangeRate || !amountUsed) return [false, "Dados inválidos."];

    try {
        const token = req.session.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        
        const converter = new CurrencyConverterModel({ targetCurrency, exchangeRate, amountUsed, sourceCurrency: "EUR", userId: userId });
        await converter.save();

        // Atualiza o histórico do usuário para incluir a conversão
        const user = await UserModel.findById(userId);
        user.history.push(converter);
        await user.save();

        return [true, null];
    } catch (error) {
        return [false, error.message];
    }
};

// Função para buscar conversores em um período específico
const getConverterInPeriod = async (req, _res) => {
    const { startDate, endDate } = req.body;

    const token = req.session.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    try {
        const converters = await CurrencyConverterModel.find({
            userId: userId,
            createdAt: { $gte: startDate, $lt: endDate },
        });

        return [converters, null];
    } catch (error) {
        return [null, error.message];
    }
};

// Função para buscar conversores por moeda
const getConverterByCurrency = async (req, _res) => {
    const { currency } = req.body;

    const token = req.session.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    try {
        const converters = await CurrencyConverterModel.find({
            userId: userId,
            targetCurrency: {
                $regex: new RegExp(String(currency).trim().toLowerCase(), 'i'),
            },
        });

        return [converters, null];
    } catch (error) {
        return [null, error.message];
    }
};

// Função para buscar conversores por taxa de câmbio
const getConverterByExchangeRate = async (req, _res) => {
    const { startValue, endValue } = req.body;

    const token = req.session.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    try {
        const converters = await CurrencyConverterModel.find({
            userId: userId,
            exchangeRate: {
                $gte: startValue,
                $lt: endValue,
            },
        });

        return [converters, null];
    } catch (error) {
        return [null, error.message];
    }
};

// Função para buscar todos os conversores
const getAllConverter = async (req, _res) => {
    try {

        const token = req.session.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const converters = await CurrencyConverterModel.find({
            userId: userId,
        });

    try {
        const converters = await CurrencyConverterModel.find({ userId: req.session.userId }).lean();
        return [converters, null];
    } catch (error) {
        return [null, error.message];
    }
};

// Função para deletar um conversor
const deleteConverter = async (req, _res) => {
    if (!req.session.userId) return [false, "Usuário não autenticado."];

    try {
        const converter = await CurrencyConverterModel.findById(req.params.id);
        if (!converter) return [false, "Conversor não encontrado."];

        await CurrencyConverterModel.findByIdAndDelete(req.params.id);
        return [true, null];
    } catch (error) {
        return [false, error.message];
    }
};

module.exports = {
    createConverter,
    getAllConverter,
    getConverterInPeriod,
    getConverterByCurrency,
    getConverterByExchangeRate,
    deleteConverter,
};
