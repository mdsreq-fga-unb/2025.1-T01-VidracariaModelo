// agendamento_routes.js
const express = require('express');
const pool = require('../Db'); // seu pool do PostgreSQL

const router = express.Router();

// Criar agendamento - RF01
router.post('/', async (req, res) => {
    const { cpf_cliente, data, horario, observacoes } = req.body;

    try {
        // Verifica se horário está disponível para a data (RN02, RN03)
        const existe = await pool.query(
            'SELECT * FROM agendamento WHERE data = $1 AND horario = $2',
            [data, horario]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Horário já agendado' });
        }

        // Insere o agendamento
        const result = await pool.query(
            `INSERT INTO agendamento (cpf_cliente, data, horario, observacoes)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [cpf_cliente, data, horario, observacoes]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar agendamento:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Listar agendamentos - RF02
router.get('/', async (req, res) => {
    const dataFiltro = req.query.data;

    try {
        let query = `
            SELECT a.*, c.nome
            FROM agendamento a
            JOIN cliente c ON a.cpf_cliente = c.cpf
        `;
        const params = [];

        if (dataFiltro) {
            query += ' WHERE a.data = $1';
            params.push(dataFiltro);
        }

        query += ' ORDER BY a.data, a.horario';

        const result = await pool.query(query, params);

        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao listar agendamentos:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Remarcar agendamento - RF03
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { data, horario, observacoes } = req.body;

    try {
        // Verifica se o novo horário está disponível (exceto para o próprio agendamento)
        const existe = await pool.query(
            `SELECT * FROM agendamento
             WHERE data = $1 AND horario = $2 AND id_agendamento <> $3`,
            [data, horario, id]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Novo horário já está agendado' });
        }

        // Atualiza agendamento
        const result = await pool.query(
            `UPDATE agendamento
             SET data = $1, horario = $2, observacoes = $3
             WHERE id_agendamento = $4
             RETURNING *`,
            [data, horario, observacoes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao remarcar agendamento:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Cancelar agendamento - RF04
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(
            `DELETE FROM agendamento WHERE id_agendamento = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        res.json({ mensagem: 'Agendamento cancelado com sucesso' });
    } catch (err) {
        console.error('Erro ao cancelar agendamento:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
