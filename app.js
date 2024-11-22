const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const app = express();

dotenv.config();
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});