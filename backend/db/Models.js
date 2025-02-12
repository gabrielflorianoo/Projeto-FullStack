const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome inválido']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true // Garante que todos os e-mails sejam armazenados em minúsculas
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversion',
    }],
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.password.startsWith('$2b$')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const UserModel = mongoose.model('usuarios', userSchema);

module.exports = {
    UserModel
};
