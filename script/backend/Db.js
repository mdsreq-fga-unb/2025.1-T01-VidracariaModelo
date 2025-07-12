require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // necessário para Render
    }
});

pool.connect()
    .then(() => console.log('Conectado ao PostgreSQL com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao PostgreSQL:', err));

module.exports = pool;
