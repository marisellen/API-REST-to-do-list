const { Client } = require('pg');

// Configuração da conexão com o banco de dados
const client = new Client({
    user: 'postgres',               // Nome de usuário do PostgreSQL
    host: 'localhost',                 // Ou o endereço do servidor
    database: 'DB-ToDoList', // Nome do banco de dados
    password: '440452',             // Senha do usuário
    port: 5432,                        // Porta padrão do PostgreSQL
});

client.connect();  // Conecta ao banco de dados

module.exports = client;  // Exporta a conexão para usar em outros arquivos
