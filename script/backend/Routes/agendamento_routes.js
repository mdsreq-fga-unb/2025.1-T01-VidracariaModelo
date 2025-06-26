// agendamento_routes.js
const express = require('express');
const pool = require('../Db'); // seu pool do PostgreSQL

const router = express.Router();

// Criar agendamento - RF01
router.post('/', async (req, res) => {
    const { id_cliente, data, horario, observacoes } = req.body;

    try {
        // Verifica se horário está disponível para a data (ver regra RN02, RN03 simplificada aqui)
        const existe = await pool.query(
            'SELECT * FROM agendamentos WHERE data = $1 AND horario = $2',
            [data, horario]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Horário já agendado' });
        }

        // Insere o agendamento
        const result = await pool.query(
            `INSERT INTO agendamentos (id_cliente, data, horario, observacoes) VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_cliente, data, horario, observacoes]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar agendamento:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Listar agendamentos - RF02
router.get('/', async (req, res) => {
    // Opcional: filtrar por data (ex: ?data=2025-03-24)
    const dataFiltro = req.query.data;

    try {
        let query = 'SELECT a.*, c.nome FROM agendamentos a JOIN clientes c ON a.id_cliente = c.id_cliente';
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
        // Verifica se novo horário está livre
        const existe = await pool.query(
            'SELECT * FROM agendamentos WHERE data = $1 AND horario = $2 AND id_agendamento <> $3',
            [data, horario, id]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Novo horário já está agendado' });
        }

        // Atualiza o agendamento
        const result = await pool.query(
            `UPDATE agendamentos SET data = $1, horario = $2, observacoes = $3 WHERE id_agendamento = $4 RETURNING *`,
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
            'DELETE FROM agendamentos WHERE id_agendamento = $1 RETURNING *',
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
