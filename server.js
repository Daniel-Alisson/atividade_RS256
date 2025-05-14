const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

// Conexão com MongoDB local
mongoose.connect('mongodb://127.0.0.1:27017/usuarios_unifan')
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de Usuário
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  nome: String,
  email: {
    type: String,
    unique: true,
    required: [true, 'O campo email é obrigatório']
  },
  senha: String
}));

// Importa rotas públicas e injeta o modelo Usuario
const publicRoutes = require('./routes/public_routes');
app.use('/', publicRoutes(Usuario));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
