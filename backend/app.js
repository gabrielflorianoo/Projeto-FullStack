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
const cookieParser = require('cookie-parser');

require('./db/server');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:3000', // Ou a URL do seu frontend
        credentials: true, // Permite cookies e autenticação via sessão
    })
);
app.use(
    session({
        secret: "meuSegredoSuperSecreto",
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: "lax", // Permite cookies em subdomínios
            maxAge: 1000 * 60 * 60,
        },
    })
);

app.use((req, res, next) => {
    console.log("session: ", req.session.userId);
    next();
});
app.use('/users', userRouter);
app.use('/converter', converterRouter);

app.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
});
