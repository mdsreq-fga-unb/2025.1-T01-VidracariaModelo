const express = require('express');
const pool = require('../Db');

const router = express.Router();

// Busca todas as duvidas
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM duvidas_e_respostas ORDER BY duvida');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar duvidas:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Insere duvida
router.post('/', async (req, res) => {
    let { duvida, resposta } = req.body;

    if (!duvida || !resposta) {
        return res.status(400).json({ error: 'A duvida e resposta são obrigatórias' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO duvidas_e_respostas (duvida, resposta) VALUES ($1, $2) RETURNING *',
            [duvida, resposta]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar duvida:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Buscar duvida por id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM duvidas_e_respostas WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Dúvida não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar duvida' });
    }
});

// Rota para EDITAR uma dúvida (UPDATE)
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Pega o ID da URL
    const { duvida, resposta } = req.body; 

    // Validação para garantir que os campos não estão vazios
    if (!duvida || !resposta) {
        return res.status(400).json({ error: 'Os campos de dúvida e resposta são obrigatórios' });
    }

    try {
        const result = await pool.query(
            `UPDATE duvidas_e_respostas 
             SET duvida = $1, resposta = $2 
             WHERE id = $3 
             RETURNING *`, 
            [duvida, resposta, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Dúvida não encontrada para atualização' });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Erro ao editar dúvida:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para DELETAR uma dúvida (DELETE)
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Pega o ID da URL

    try {
        const result = await pool.query(
            'DELETE FROM duvidas_e_respostas WHERE id = $1 RETURNING *',
            [id]
        );
0
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Dúvida não encontrada para exclusão' });
        }

        // Se deu certo, envia uma mensagem de sucesso
        res.status(200).json({ message: 'Dúvida deletada com sucesso' });

    } catch (err) {
        console.error('Erro ao deletar dúvida:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;