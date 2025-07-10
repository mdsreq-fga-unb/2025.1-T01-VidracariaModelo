const express = require('express');
const pool = require('../Db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cliente ORDER BY nome');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/:cpf', async (req, res) => {
    const cpf = req.params.cpf;

    try {
        const result = await pool.query('SELECT * FROM cliente WHERE cpf = $1', [cpf]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/', async (req, res) => {
    let { cpf, nome, email, endereco } = req.body;

    if (!cpf || !nome) {
        return res.status(400).json({ error: 'CPF e nome são obrigatórios' });
    }

    cpf = cpf.toUpperCase();
    nome = nome.toUpperCase();
    email = email ? email.toUpperCase() : null;
    endereco = endereco ? endereco.toUpperCase() : null;

    try {
        const result = await pool.query(
            'INSERT INTO cliente (cpf, nome, email, endereco) VALUES ($1, $2, $3, $4) RETURNING *',
            [cpf, nome, email, endereco]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar cliente:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.put('/:cpf', async (req, res) => {
    const cpf = req.params.cpf;
    let { nome, email, endereco } = req.body;

    if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    nome = nome.toUpperCase();
    email = email ? email.toUpperCase() : null;
    endereco = endereco ? endereco.toUpperCase() : null;

    try {
        const result = await pool.query(
            'UPDATE cliente SET nome = $1, email = $2, endereco = $3 WHERE cpf = $4 RETURNING *',
            [nome, email, endereco, cpf]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar cliente:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.delete('/:cpf', async (req, res) => {
    const cpf = req.params.cpf;

    try {
        const result = await pool.query('DELETE FROM cliente WHERE cpf = $1 RETURNING *', [cpf]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.json({ mensagem: 'Cliente deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar cliente:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
