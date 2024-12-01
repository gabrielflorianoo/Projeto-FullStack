const express = require('express');
const session = require('express-session');
const userRouter = require('./routes/user');

const app = express();

app.use(express.json());
app.use(
    session({
        secret: process.env.SECRET || 'um_segredo_muito_melhor_que_o_anterior',
        saveUninitialized: true,
        resave: false,
        cookie: {},
    }),
);
app.use('/', userRouter);

app.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});
