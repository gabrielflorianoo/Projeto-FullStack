const { ConverterModel } = require('../db/Models');

const createConverter = async (req, _res) => {
    const { targetCurrency, exchangeRate } = req.body;

    try {
        const converter = new ConverterModel({ targetCurrency, exchangeRate });
        await converter.save();

        return [success, null];
    } catch (error) {
        return [null, error];
    }
};

const getConverterInPeriod = async (req, _res) => {
    const { startDate, endDate } = req.body;

    try {
        const converters = await ConverterModel.find({
            createdAt: { $gte: startDate, $lt: endDate },
        });

        return [converters, null];
    } catch (error) {
        return [null, error];
    }
}

module.exports = {
    createConverter,
    getConverterInPeriod,
}