  const express = require('express');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const fs = require('fs');
  const path = require('path');

  const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf8');
  const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, 'public.key'), 'utf8');
  
  //const SECRET = 'saladadefrutas';

  module.exports = (Usuario) => {
    const router = express.Router();

    // Rota de cadastro
    router.post('/cadastro', async (req, res) => {
      try {
        const { nome, email, senha } = req.body;

        const salt = await bcrypt.genSalt(10)
        const hash_senha = await bcrypt.hash(senha,salt)

        const usuario = new Usuario({ nome, email, senha: hash_senha });
        await usuario.save();

        res.status(201).send({
          mensagem: 'Usuário cadastrado com sucesso!',
          usuario: {
            id: usuario._id,
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha// A senha não é retornada por segurança
          }
        });
      } catch (err) {
        if (err.code === 11000) {
          return res.status(400).send({ erro: 'Email já cadastrado' });
        }
        res.status(500).send({ erro: 'Erro ao cadastrar usuário', detalhes: err.message });
      }
    });

    // Rota de login
    router.post('/login', async (req, res) => {
      try {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
          return res.status(400).send({ erro: 'Email ou senha inválidos' });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
          return res.status(400).send({ erro: 'Email ou senha inválidos' });
        }

        const token = jwt.sign(
          { id: usuario._id, email: usuario.email }, // payload
          PRIVATE_KEY, // chave privada
          { algorithm: 'RS256', expiresIn: '1h' } // tempo de expiração e tipo de algoritmo
        );

        res.status(200).send({
          mensagem: 'Login realizado com sucesso!',
          token,
          usuario: {
            id: usuario._id,
            nome: usuario.nome,
            email: usuario.email
          }
        });
      } catch (err) {
        res.status(500).send({ erro: 'Erro ao realizar login', detalhes: err.message });
      }
    });

    router.get('/auth', (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ erro: 'Token não fornecido' });
        }

        try {
            const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
            res.status(200).send({ mensagem: 'Acesso autorizado', dados: decoded });
        } catch (err) {
            res.status(401).send({ erro: 'Token inválido ou expirado' });
        }
    });

    return router;
  };