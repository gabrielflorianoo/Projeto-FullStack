const { CurrencyConverterModel, UserModel } = require('../db/Models');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Middleware para extrair usuário do token
const getUserIdFromToken = (req) => {
    const token = req.session.token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('Token não fornecido');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
};

// Deixa o cliente Redis disponível para uso assíncrono
const getAsync = promisify(req.redisClient.get).bind(req.redisClient);
const setAsync = promisify(req.redisClient.set).bind(req.redisClient);

// Criar um novo conversor
const createConverter = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const { targetCurrency, exchangeRate, amountUsed } = req.body;
        
        const converter = await CurrencyConverterModel.create({
            userId,
            amountUsed,
            exchangeRate,
            targetCurrency,
            sourceCurrency: "EUR",
        });

        await UserModel.findByIdAndUpdate(userId, { $push: { history: converter._id } });

        res.status(201).json(converter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Buscar conversores em um período específico
const getConverterInPeriod = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const { date } = req.body;

        const cacheKey = `${userId}-${date.startDate}-${date.endDate}`;
        if (req.redisClient) {
            const cachedData = await getAsync(cacheKey);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
        }

        const converters = await CurrencyConverterModel.find({
            userId,
            createdAt: { $gte: new Date(date.startDate), $lte: new Date(date.endDate) }
        });

        if (req.redisClient) {
            await setAsync(cacheKey, JSON.stringify(converters), 'EX', 60 * 5);
        }
        res.json(converters);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Buscar conversores por moeda
const getConverterByCurrency = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const { currency } = req.body;

        const cacheKey = `${userId}-${currency}`;
        if (req.redisClient) {
            const cachedData = await getAsync(cacheKey);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
        }
        
        const converters = await CurrencyConverterModel.find({
            userId,
            targetCurrency: { $regex: new RegExp(currency, 'i') }
        });

        if (req.redisClient) {
            await setAsync(cacheKey, JSON.stringify(converters), 'EX', 60 * 5);
        }
        res.json(converters);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Buscar conversores por taxa de câmbio
const getConverterByExchangeRate = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const { exchangeRate } = req.body;
        
        const cacheKey = `${userId}-${exchangeRate.startValue}-${exchangeRate.endValue}`;
        if (req.redisClient) {
            const cachedData = await getAsync(cacheKey);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
        }

        const converters = await CurrencyConverterModel.find({
            userId,
            exchangeRate: { $gte: parseFloat(exchangeRate.startValue), $lte: parseFloat(exchangeRate.endValue) }
        });

        if (req.redisClient) {
            await setAsync(cacheKey, JSON.stringify(converters), 'EX', 60 * 5);
        }
        res.json(converters);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Buscar todas as conversões do usuário
const getAllConverters = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const converters = await CurrencyConverterModel.find({ userId });
        res.json(converters);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Deletar um conversor
const deleteConverter = async (req, res) => {
    try {
        const { id } = req.params;
        await CurrencyConverterModel.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createConverter,
    getAllConverters,
    getConverterInPeriod,
    getConverterByCurrency,
    getConverterByExchangeRate,
    deleteConverter
};