const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId, // Referência ao modelo Converter
        ref: 'Conversion', // Nome do modelo Converter
    }],
}, {
    timestamps: true
});

const currencyConversionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Referência ao modelo User
        ref: 'usuarios', // Nome do modelo User
    },
    targetCurrency: { // Moeda alvo
        type: String,
        required: true,
        trim: true
    },
    exchangeRate: { // Taxa de câmbio
        type: Number,
        required: true
    },
    sourceCurrency: { // Moeda usada para o câmbio
        type: String,
        required: false,
        trim: true
    },
    amountUsed: { // Valor usado na conversão
        type: Number,
        required: true
    },
}, {
    timestamps: true // Garante que o registro tenha createdAt e updatedAt
});

const SessionSchema = new mongoose.Schema({
    _id: String, // ID da sessão gerado pelo `connect-mongo`
    token: String,
    expires: Date, // Data de expiração
}, { collection: "sessions" }); // Certifique-se de usar a coleção correta

// Criação dos modelos baseados nos schemas
const UserModel = mongoose.model('usuarios', userSchema);
const CurrencyConverterModel = mongoose.model('Conversion', currencyConversionSchema);
const SessionModel = mongoose.model("Session", SessionSchema);

module.exports = {
    UserModel,
    SessionModel,
    CurrencyConverterModel,
};