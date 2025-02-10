require('dotenv').config({ path: './backend/.env' }); // Permite usar variáveis de ambiente

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('Variáveis de ambiente DB_USER ou DB_PASSWORD não foram definidas');
    process.exit(1);
}

const cors = require('cors');
const express = require('express');
const session = require('express-session');
const userRouter = require('./routes/user');
const converterRouter = require('./routes/converter');
require('./db/server');

const app = express();

app.use(express.json());
app.use(
    session({
        secret: process.env.SECRET || 'um_segredo_muito_melhor_que_o_anterior',
        saveUninitialized: true,
        resave: false,
    }),
);
app.use(cors());

app.use('/users', userRouter);
app.use('/converter', converterRouter);

app.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});
