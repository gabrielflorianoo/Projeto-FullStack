require('dotenv').config({ path: './backend/.env' }); // Permite usar variáveis de ambiente

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('Variáveis de ambiente DB_USER ou DB_PASSWORD não foram definidas');
    process.exit(1);
}

const cors = require('cors');
const redis = require('redis');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const userRouter = require('./routes/user');
const converterRouter = require('./routes/conversion');

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.error('Erro no Redis:', err));
redisClient.connect();

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
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@teste.upiwi.mongodb.net/?retryWrites=true&w=majority&appName=teste`, // URL do seu banco MongoDB
        ttl: 60 * 60 * 3, // Tempo de vida da sessão (3h)
    }),
    secret: "meuSegredoSuperSecreto",
    resave: false,
    saveUninitialized: false, // Não salva sessões vazias
    cookie: {
        sameSite: "none", // Necessário para CORS funcionar em SPA
        secure: process.env.NODE_ENV === 'production', // Deve ser true na Vercel
        maxAge: 1000 * 60 * 60 * 3,
    },
}));

app.use('/users', userRouter);
app.use('/convertions', converterRouter);

app.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});