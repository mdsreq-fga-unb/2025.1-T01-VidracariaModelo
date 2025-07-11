const express = require('express');
const pool = require('../Db');
const router = express.Router();



// RN50: Listar vendas com filtros
router.get('/', async (req, res) => {
    // Filtros possíveis: cliente_cpf, produto_id, data_inicio, data_fim, forma_pagamento
    const { cliente_cpf, produto_id, data_inicio, data_fim, forma_pagamento } = req.query;

    let query = `
        SELECT DISTINCT
            v.id,
            v.data_venda,
            v.valor,
            v.forma_pagamento,
            c.nome AS cliente_nome,
            c.cpf AS cliente_cpf
        FROM venda v
        JOIN orcamento o ON v.id_orcamento = o.id
        JOIN cliente c ON o.cpf_cliente = c.cpf
        LEFT JOIN venda_itens vi ON v.id = vi.id_venda
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (cliente_cpf) {
        query += ` AND c.cpf = $${paramIndex++}`;
        params.push(cliente_cpf);
    }
    if (produto_id) {
        query += ` AND vi.id_produto = $${paramIndex++}`;
        params.push(produto_id);
    }
    if (data_inicio) {
        query += ` AND v.data_venda >= $${paramIndex++}`;
        params.push(data_inicio);
    }
    if (data_fim) {
        query += ` AND v.data_venda <= $${paramIndex++}`;
        params.push(data_fim);
    }
    if (forma_pagamento) {
        query += ` AND v.forma_pagamento ILIKE $${paramIndex++}`;
        params.push(`%${forma_pagamento}%`);
    }

    query += ` ORDER BY v.data_venda DESC`;

    try {
        const result = await pool.query(query, params);

        // RN51: Calcular o total das vendas filtradas
        const totalVendas = result.rows.reduce((sum, venda) => sum + parseFloat(venda.valor), 0);

        res.json({
            vendas: result.rows,
            total: totalVendas.toFixed(2)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// RN52, RN54: Buscar venda pelo id com todos os detalhes (itens, pagamentos, etc.)
router.get('/detalhes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Busca os dados principais da venda
        const vendaQuery = pool.query(`
             SELECT 
        v.*, 
        c.nome as cliente_nome, 
        c.email as cliente_email, 
        c.cpf as cliente_cpf
    FROM venda v
    JOIN orcamento o ON v.id_orcamento = o.id
    JOIN cliente c ON o.cpf_cliente = c.cpf
    WHERE v.id = $1
        `, [id]);

        // Busca os itens da venda
        const itensQuery = pool.query(`
            SELECT vi.*, p.nome as produto_nome
            FROM venda_itens vi
            JOIN produto p ON vi.id_produto = p.id
            WHERE vi.id_venda = $1
        `, [id]);

        // Busca os pagamentos da venda
        const pagamentosQuery = pool.query('SELECT * FROM pagamentos WHERE id_venda = $1', [id]);

        const [vendaResult, itensResult, pagamentosResult] = await Promise.all([vendaQuery, itensQuery, pagamentosQuery]);

        if (vendaResult.rows.length === 0) {
            return res.status(404).json({ error: "Venda não encontrada" });
        }

        const venda = vendaResult.rows[0];
        venda.itens = itensResult.rows;
        venda.pagamentos = pagamentosResult.rows;

        res.json(venda);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// RN48, RN55, RN56, RN57: Criar nova venda
router.post('/', async (req, res) => {
    const {
        id_orcamento,
        forma_pagamento,
        origem,
        itens // Espera um array de itens: [{id_produto, quantidade, valor_unitario, medida, descricao}]
    } = req.body;

    if (!id_orcamento || !forma_pagamento || !itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes: id_orcamento, forma_pagamento e itens." });
    }

    // RN60: Recálculo automático do valor total
    const valor_total = itens.reduce((sum, item) => sum + (item.quantidade * item.valor_unitario), 0);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const vendaResult = await client.query(
            `INSERT INTO venda (id_orcamento, forma_pagamento, valor, origem)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_orcamento, forma_pagamento, valor_total, origem]
        );
        const novaVenda = vendaResult.rows[0];

        // Inserir os itens da venda
        for (const item of itens) {
            await client.query(
                `INSERT INTO venda_itens (id_venda, id_produto, quantidade, valor_unitario, medida, descricao)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [novaVenda.id, item.id_produto, item.quantidade, item.valor_unitario, item.medida, item.descricao]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Venda criada com sucesso", venda: novaVenda });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: "Erro interno ao criar venda" });
    } finally {
        client.release();
    }
});

// RN57, RN59, RN61: Atualizar venda
router.put('/detalhes/:id', async (req, res) => {
    const { id } = req.params;
    const {
        forma_pagamento,
        origem,
        itens,      // array de itens: { id_produto, quantidade, valor_unitario, medida, descricao }
        pagamentos, // array de pagamentos: { data_pagamento, valor_pago, forma_pagamento, status }
    } = req.body;

    if (!forma_pagamento || !origem || !Array.isArray(itens) || itens.length === 0 || !Array.isArray(pagamentos)) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes ou inválidos" });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Atualizar dados da venda (data_venda permanece)
        // RN60: Recálculo automático do valor total
        const valor_total = itens.reduce((sum, item) => sum + (item.quantidade * item.valor_unitario), 0);

        // Atualizar dados da venda (data_venda permanece)
        const vendaAtualizada = await client.query(
            `UPDATE venda SET forma_pagamento = $1, origem = $2, valor = $3 WHERE id = $4 RETURNING *`,
            [forma_pagamento, origem, valor_total, id]
        );


        if (vendaAtualizada.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Venda não encontrada" });
        }

        // Deletar itens e pagamentos antigos para essa venda
        await client.query('DELETE FROM venda_itens WHERE id_venda = $1', [id]);
        await client.query('DELETE FROM pagamentos WHERE id_venda = $1', [id]);

        // Inserir os novos itens
        for (const item of itens) {
            await client.query(
                `INSERT INTO venda_itens (id_venda, id_produto, quantidade, valor_unitario, medida, descricao)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [id, item.id_produto, item.quantidade, item.valor_unitario, item.medida, item.descricao]
            );
        }

        // Inserir os novos pagamentos
        for (const pagamento of pagamentos) {
            await client.query(
                `INSERT INTO pagamentos (id_venda, data_pagamento, valor_pago, forma_pagamento, status)
         VALUES ($1, $2, $3, $4, $5)`,
                [id, pagamento.data_pagamento, pagamento.valor_pago, pagamento.forma_pagamento, pagamento.status || 'Confirmado']
            );
        }

        await client.query('COMMIT');
        res.json({ message: 'Venda atualizada com sucesso' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: "Erro interno ao atualizar venda" });
    } finally {
        client.release();
    }
});


// RN57: Deletar venda
router.delete('/detalhes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // A deleção em cascata (ON DELETE CASCADE) cuidará das tabelas 'venda_itens' e 'pagamentos'.
        // Seria bom também auditar a exclusão.
        const result = await pool.query('DELETE FROM venda WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Venda não encontrada" });
        }

        res.json({ message: "Venda deletada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno ao deletar venda" });
    }
});

module.exports = router;

