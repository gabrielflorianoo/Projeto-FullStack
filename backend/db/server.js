const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mycluster.mx39qqa.mongodb.net/Conversor?retryWrites=true&w=majority&appName=MyCluster`;

mongoose.connect(uri)
    .then(() => console.log('Conectado ao banco de dados'))
    .catch((error) => console.error('Erro ao conectar ao banco de dados:', error));