const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
require('dotenv').config();

const app = express();

// Configuração do Redis para sessão
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

// Middleware de segurança
app.use(helmet());
app.use(morgan('combined'));
app.use(compression()); // Ativando compressão para otimizar o frontend

// Configuração da sessão com Redis
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 60000 }
}));

// Middleware de cache
const cacheMiddleware = (req, res, next) => {
    res.set('Cache-Control', 'public, max-age=300'); // Cache de 5 minutos
    next();
};

app.use(cacheMiddleware);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@teste.upiwi.mongodb.net/?retryWrites=true&w=majority&appName=teste`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10 // Configuração do pool de conexões para otimizar o uso do banco
}).then(() => console.log('Conectado ao banco de dados'))
  .catch((error) => console.error('Erro ao conectar ao banco de dados:', error));

module.exports = app;
