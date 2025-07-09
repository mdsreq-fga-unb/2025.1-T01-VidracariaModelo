const express = require('express');
const pool = require('../Db');

const router = express.Router();

// Criar agendamento - RF01
router.post('/', async (req, res) => {
    const { nome_cliente, data, horario, observacoes, telefone = '', endereco = '' } = req.body;

    try {
        // Busca o id do cliente pelo nome
        let clienteResult = await pool.query(
            'SELECT id FROM cliente WHERE nome = $1',
            [nome_cliente]
        );

        let id_cliente;
        if (clienteResult.rows.length === 0) {
            // Cria o cliente se não existir
            const insertCliente = await pool.query(
                'INSERT INTO cliente (nome, telefone, endereco) VALUES ($1, $2, $3) RETURNING id',
                [nome_cliente, telefone, endereco]
            );
            id_cliente = insertCliente.rows[0].id;
        } else {
            id_cliente = clienteResult.rows[0].id;
        }

        // Verifica se horário está disponível para a data
        const existe = await pool.query(
            'SELECT * FROM agendamento WHERE data = $1 AND horario = $2',
            [data, horario]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Horário já agendado' });
        }

        // Insere o agendamento
        const result = await pool.query(
            `INSERT INTO agendamento (data, horario, status, observacoes, id_cliente)
             VALUES ($1, $2, $3, $4, $5) RETURNING id_agendamento`,
            [data, horario, 'agendado', observacoes, id_cliente]
        );

        res.status(201).json({
            id_agendamento: result.rows[0].id_agendamento,
            message: 'Agendamento criado com sucesso'
        });
    } catch (err) {
        console.error('Erro ao criar agendamento:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Listar agendamentos - RF02
router.get('/', async (req, res) => {
    const dataFiltro = req.query.data;
    console.log("chamando get agendamentos");

    try {
        let query = `
            SELECT a.id_agendamento, a.data, a.horario, a.status, a.observacoes, c.nome as nome_cliente
            FROM agendamento a
            JOIN cliente c ON a.id_cliente = c.id
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

// Listar agendamento por ID - RF02
router.get('/:id_agendamento', async (req, res) => {
    try {
        const { id_agendamento } = req.params; // ← Corrigido para id_agendamento
        const result = await pool.query(
            'SELECT a.*, c.nome FROM agendamento a JOIN cliente c ON a.id_cliente = c.id WHERE a.id_agendamento = $1',
            [id_agendamento]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Agendamento não encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno" });
    }
});


// Remarcar agendamento - RF03
router.put('/:id_agendamento', async (req, res) => {
    const id_agendamento = req.params.id_agendamento;
    const { data, horario, observacoes } = req.body;

    try {
        // Verifica se o novo horário está disponível (exceto para o próprio agendamento)
        const existe = await pool.query(
            `SELECT * FROM agendamento
             WHERE data = $1 AND horario = $2 AND id_agendamento <> $3`,
            [data, horario, id_agendamento]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Novo horário já está agendado' });
        }

        // Atualiza agendamento
        const result = await pool.query(
            `UPDATE agendamento
             SET data = $1, horario = $2, observacoes = $3
             WHERE id_agendamento = $4
             RETURNING id_agendamento`,
            [data, horario, observacoes, id_agendamento]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        res.json({
            id_agendamento: result.rows[0].id_agendamento,
            message: 'Agendamento atualizado com sucesso'
        });
    } catch (err) {
        console.error('Erro ao remarcar agendamento:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Cancelar agendamento - RF04
router.delete('/:id_agendamento', async (req, res) => {
    const id_agendamento = req.params.id_agendamento;

    try {
        const result = await pool.query(
            `DELETE FROM agendamento WHERE id_agendamento = $1 RETURNING id_agendamento`,
            [id_agendamento]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        res.json({
            id_agendamento: result.rows[0].id_agendamento,
            message: 'Agendamento cancelado com sucesso'
        });
    } catch (err) {
        console.error('Erro ao cancelar agendamento:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;