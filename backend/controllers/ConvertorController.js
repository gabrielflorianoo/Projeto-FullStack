const { CurrencyConverterModel, UserModel } = require('../db/Models');

// Função para criar um novo conversor
const createConverter = async (req, _res) => {
    const { targetCurrency, exchangeRate, amountUsed } = req.body;

    try {
        const converter = new CurrencyConverterModel({ targetCurrency, exchangeRate, amountUsed, sourceCurrency: "EUR", userId: req.session.userId });
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
            userId: req.session.userId,
            createdAt: { $gte: startDate, $lt: endDate },
        });

        return [converters, null];
    } catch (error) {
        return [null, error];
    }
};

// Função para buscar conversores por moeda
const getConverterByCurrency = async (req, _res) => {
    const { currency } = req.body;

    try {
        const converters = await CurrencyConverterModel.find({
            userId: req.session.userId,
            targetCurrency: {
                $regex: new RegExp(String(currency).trim().toLowerCase(), 'i'),
            },
        });

        return [converters, null];
    } catch (error) {
        return [null, error];
    }
}

// Função para buscar conversores por taxa de câmbio
const getConverterByExchangeRate = async (req, _res) => {
    const { startValue, endValue } = req.body;

    try {
        const converters = await CurrencyConverterModel.find({
            userId: req.session.userId,
            exchangeRate: {
                $gte: startValue,
                $lt: endValue,
            },
        });

        return [converters, null];
    } catch (error) {
        return [null, error];
    }
}

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

// Função para deletar um conversor
const deleteConverter = async (req, _res) => {
    try {
        await CurrencyConverterModel.findByIdAndDelete(req.params.id);

        return [true, null];
    } catch (error) {
        return [false, error];
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