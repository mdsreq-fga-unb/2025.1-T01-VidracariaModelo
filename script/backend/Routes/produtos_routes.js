const express = require('express');
const pool = require('../Db'); // seu pool do pg configurado
const router = express.Router();

// Listar todos produtos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produto ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
});

// Buscar produto por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM produto WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

// Criar produto
router.post('/', async (req, res) => {
    const { nome, valor_m2 } = req.body;
    if (!nome || valor_m2 == null) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome, valor_m2' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO produto (nome, valor_m2) VALUES ($1, $2) RETURNING *',
            [nome, valor_m2]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, valor_m2 } = req.body;
    if (!nome || valor_m2 == null) {
        return res.status(400).json({ error: 'Campos obrigatórios: nome, valor_m2' });
    }
    try {
        const result = await pool.query(
            'UPDATE produto SET nome = $1, valor_m2 = $2 WHERE id = $3 RETURNING *',
            [nome, valor_m2, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

// Deletar produto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM produto WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
});

module.exports = router;
