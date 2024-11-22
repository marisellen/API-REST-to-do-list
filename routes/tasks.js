const express = require('express');
const db = require('../models/db');
const authenticate = require('../middlewares/auth');
const router = express.Router();

// Middleware de autenticação
router.use(authenticate);

// Lista todas as tarefas
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tasks WHERE user_id = $1', [req.userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
});

// Busca uma tarefa pelo ID
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
});

// Cria uma nova tarefa
router.post('/', async (req, res) => {
    const { title } = req.body;

    console.log('User ID:', req.userId); // Verifique o valor de userId

    try {
        const result = await db.query('INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING *', [req.userId, title]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar tarefa:', err); // Log de erro
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
});

// Atualiza uma tarefa
router.put('/:id', async (req, res) => {
    const { title, completed } = req.body;

    try {
        const result = await db.query(
            'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [title, completed, req.params.id, req.userId]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
});

module.exports = router;