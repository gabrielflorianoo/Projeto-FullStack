require('dotenv').config({ path: './backend/.env' }); // Permite usar variáveis de ambiente

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('Variáveis de ambiente DB_USER ou DB_PASSWORD não foram definidas');
    process.exit(1);
}

const cors = require('cors');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/user');
const converterRouter = require('./routes/conversion');

require('./db/server');

const app = express();

app.set('trust proxy', true);

app.use(
    cors({
        origin: ['http://localhost:3000', 'https://gabrielflorianoo.github.io', 'https://gabrielflorianoo.github.io/Projeto-FullStack'], // Ou a URL do seu frontend
        credentials: true, // Permite o envio de cookies
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "meuSegredoSuperSecreto",
    resave: false,
    saveUninitialized: true, // Não salva sessões vazias
    cookie: {
        sameSite: "lax", // Necessário para CORS funcionar em SPA
        secure: false, // Deve ser true na Vercel
        maxAge: 1000 * 60 * 60 * 3,
    },
}));

app.use('/users', userRouter);
app.use('/convertions', converterRouter);

app.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});