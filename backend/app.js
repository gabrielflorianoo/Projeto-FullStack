const express = require("express");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use('/', userRouter);

app.listen(8000, () => {
    console.log('Servidor rodando na porta 8000');
})
