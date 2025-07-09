const express = require('express');
const pool = require('../Db');

const router = express.Router();

// Listar todas as vendas
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                v.id_venda,
                c.nome AS cliente_nome,
                p.nome AS produto_nome,
                a.valor_total,
                a.descricao_servico,
                v.forma_pagamento, 
                v.valor,
                v.data_venda
             FROM venda v
             JOIN servico s ON v.id_servico = s.id_servico
             JOIN atividade a ON s.id_atividade = a.id_atividade
             JOIN agendamento ag ON a.id_agendamento = ag.id_agendamento
             JOIN cliente c ON ag.id_cliente = c.id
             JOIN produto p ON v.id_produto = p.id_produto`
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Nenhuma venda encontrada" });
        }

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno" });
    }
});

// Buscar venda pelo id com detalhes
router.get('/detalhes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT
                v.id_venda,
                c.nome AS cliente_nome,
                c.telefone AS cliente_telefone,
                p.nome AS produto_nome,
                a.valor_total,
                a.descricao_servico,
                v.medida,
                v.forma_pagamento, 
                v.valor,
                v.data_venda,
                s.status AS status_servico
             FROM venda v
             JOIN servico s ON v.id_servico = s.id_servico
             JOIN atividade a ON s.id_atividade = a.id_atividade
             JOIN agendamento ag ON a.id_agendamento = ag.id_agendamento
             JOIN cliente c ON ag.id_cliente = c.id
             JOIN produto p ON v.id_produto = p.id_produto
             WHERE v.id_venda = $1`, [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Venda não encontrada" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno" });
    }
});

// Criar nova venda
router.post('/', async (req, res) => {
    const {
        data_venda,
        forma_pagamento,
        valor,
        id_servico,
        id_produto,
        medida
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO venda (data_venda, forma_pagamento, valor, id_servico, id_produto, medida)
             VALUES (COALESCE($1, CURRENT_DATE), $2, $3, $4, $5, $6)
             RETURNING *`,
            [data_venda, forma_pagamento, valor, id_servico, id_produto, medida]
        );

        res.status(201).json({ message: "Venda criada com sucesso", venda: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno ao criar venda" });
    }
});

// Atualizar venda pelo id
router.put('/detalhes/:id', async (req, res) => {
    const { id } = req.params;
    const { forma_pagamento, medida, id_produto, id_servico, data_venda, valor, cpf_admin } = req.body;

    try {
        const result = await pool.query(
            `UPDATE venda
             SET 
                forma_pagamento = COALESCE($1, forma_pagamento),
                medida = COALESCE($2, medida),
                id_produto = COALESCE($3, id_produto),
                id_servico = COALESCE($4, id_servico),
                data_venda = COALESCE($5, data_venda),
                valor = COALESCE($6, valor),
                cpf_admin = COALESCE($7, cpf_admin)
             WHERE id_venda = $8
             RETURNING *`,
            [forma_pagamento, medida, id_produto, id_servico, data_venda, valor, cpf_admin, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Venda não encontrada" });
        }

        res.json({ message: 'Venda atualizada com sucesso', venda: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno ao atualizar venda" });
    }
});

// Deletar venda pelo id
router.delete('/detalhes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM venda WHERE id_venda = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Venda não encontrada" });
        }

        res.json({ message: "Venda deletada com sucesso", venda: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno ao deletar venda" });
    }
});

module.exports = router;
