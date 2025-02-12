const { CurrencyConverterModel, UserModel } = require('../db/Models');

// Função para criar um novo conversor
const createConverter = async (req, _res) => {
    const { targetCurrency, exchangeRate, amountUsed } = req.body;

    if (!req.session.userId) return [false, "Usuário não autenticado."];
    if (!targetCurrency || !exchangeRate || !amountUsed) return [false, "Dados inválidos."];

    try {
        const converter = new CurrencyConverterModel({
            targetCurrency,
            exchangeRate,
            amountUsed,
            sourceCurrency: "EUR",
            userId: req.session.userId
        });
        await converter.save();

        // Atualiza o histórico do usuário
        await UserModel.findByIdAndUpdate(req.session.userId, { $push: { history: converter._id } });

        return [true, null];
    } catch (error) {
        return [false, error.message];
    }
};

// Função para buscar conversores em um período específico
const getConverterInPeriod = async (req, _res) => {
    const { startDate, endDate } = req.body;

    if (!req.session.userId) return [null, "Usuário não autenticado."];
    if (!startDate || !endDate) return [null, "Datas inválidas."];

    try {
        const converters = await CurrencyConverterModel.find({
            userId: req.session.userId,
            createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }
        }).lean();

        return [converters, null];
    } catch (error) {
        return [null, error.message];
    }
};

// Função para buscar conversores por moeda
const getConverterByCurrency = async (req, _res) => {
    const { currency } = req.body;

    if (!req.session.userId) return [null, "Usuário não autenticado."];
    if (!currency) return [null, "Moeda inválida."];

    try {
        const converters = await CurrencyConverterModel.find({
            userId: req.session.userId,
            targetCurrency: { $regex: new RegExp(currency.trim(), 'i') }
        }).lean();

        return [converters, null];
    } catch (error) {
        return [null, error.message];
    }
};

// Função para buscar conversores por taxa de câmbio
const getConverterByExchangeRate = async (req, _res) => {
    const { startValue, endValue } = req.body;

    if (!req.session.userId) return [null, "Usuário não autenticado."];
    if (startValue == null || endValue == null) return [null, "Valores inválidos."];

    try {
        const converters = await CurrencyConverterModel.find({
            userId: req.session.userId,
            exchangeRate: { $gte: startValue, $lt: endValue }
        }).lean();

        return [converters, null];
    } catch (error) {
        return [null, error.message];
    }
};

// Função para buscar todos os conversores
const getAllConverter = async (req, _res) => {
    if (!req.session.userId) return [null, "Usuário não autenticado."];

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
