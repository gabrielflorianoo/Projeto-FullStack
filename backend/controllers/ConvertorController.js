const { CurrencyConverterModel, UserModel } = require('../db/Models');

// Função para criar um novo conversor
const createConverter = async (req, _res) => {
    const { targetCurrency, exchangeRate, amountUsed } = req.body;

    try {
        const converter = new CurrencyConverterModel({ targetCurrency, exchangeRate, amountUsed, sourceCurrency: "EUR" });
        await converter.save();

        // Atualiza o histórico do usuário para incluir a conversão
        const user = await UserModel.findById(req.session.userId);
        user.history.push(converter);
        await user.save();

        return [true, null];
    } catch (error) {
        return [false, error];
    }
};

// Função para buscar conversores em um período específico
const getConverterInPeriod = async (req, _res) => {
    const { startDate, endDate } = req.body;

    try {
        const converters = await CurrencyConverterModel.find({
            userId: req.params.id,
            createdAt: { $gte: startDate, $lt: endDate },
        });

        return [converters, null];
    } catch (error) {
        return [null, error];
    }
};

// Função para buscar todos os conversores
const getAllConverter = async (req, _res) => {
    try {
        const converters = await CurrencyConverterModel.find({
            userId: req.session.userId,
        });

        return [converters, null];
    } catch (error) {
        return [null, error];
    }
};

// Função para atualizar um conversor existente
const updateConverter = async (req, _res) => {
    const { id, targetCurrency, exchangeRate } = req.body;

    try {
        const converter = await CurrencyConverterModel.findByIdAndUpdate(
            id,
            { targetCurrency, exchangeRate },
            { new: true }
        );

        return [converter, null];
    } catch (error) {
        return [null, error];
    }
};

// Função para deletar um conversor
const deleteConverter = async (req, _res) => {
    const { id } = req.body;

    try {
        await CurrencyConverterModel.findByIdAndDelete(id);

        return [true, null];
    } catch (error) {
        return [false, error];
    }
};

module.exports = {
    createConverter,
    getAllConverter,
    getConverterInPeriod,
    updateConverter,
    deleteConverter,
};