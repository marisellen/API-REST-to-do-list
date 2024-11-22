const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const router = express.Router();

require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

// Registro de usuário
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('=== Início da Rota de Registro ===');
        console.log('Dados recebidos:');
        console.log('Email:', email);

        // Gerar hash da senha
        console.log('Gerando hash da senha...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hash gerado com sucesso:', hashedPassword);

        // Inserir usuário no banco
        console.log('Inserindo usuário no banco de dados...');
        await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        console.log('Usuário inserido com sucesso:', email);

        // Resposta de sucesso
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
        console.error('Erro ao registrar usuário:', err); // Log detalhado do erro
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    } finally {
        console.log('=== Fim da Rota de Registro ===');
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('=== Início da Rota de Login ===');
        console.log('Email recebido:', email); // Verifica se o email está sendo recebido

        // Consulta no banco
        console.log('Realizando consulta no banco de dados...');
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('Resultado da consulta:', result.rows); // Exibe o resultado da consulta

        const user = result.rows[0];
        if (!user) {
            console.log('Usuário não encontrado no banco');
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Validação da senha
        console.log('Usuário encontrado, iniciando validação da senha...');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Senha inválida para o email:', email);
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        console.log('Senha válida, gerando token JWT...');
        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
        console.log('Token gerado com sucesso:', token);

        // Retornar resposta
        console.log('Login bem-sucedido para o email:', email);
        res.json({ token });
    } catch (err) {
        console.error('Erro no servidor:', err); // Log detalhado do erro
        res.status(500).json({ error: 'Erro ao autenticar usuário' });
    } finally {
        console.log('=== Fim da Rota de Login ===');
    }
});


module.exports = router;