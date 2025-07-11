const express = require('express');
const pool = require('../Db');
const router = express.Router();

// Listar vendas com filtros
router.get('/', async (req, res) => {
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
        JOIN cliente c ON v.cpf_cliente = c.cpf
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

// Buscar venda pelo id com todos os detalhes
router.get('/detalhes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const vendaQuery = pool.query(`
            SELECT 
                v.*, 
                c.nome as cliente_nome, 
                c.cpf as cliente_cpf,
                c.email as cliente_email
            FROM venda v
            JOIN cliente c ON v.cpf_cliente = c.cpf
            WHERE v.id = $1
        `, [id]);

        const itensQuery = pool.query(`
            SELECT 
                vi.*, 
                p.nome as produto_nome,
                (vi.largura * vi.altura * vi.valor_unitario * 1.2) as valor_total_com_mdo
            FROM venda_itens vi
            JOIN produto p ON vi.id_produto = p.id
            WHERE vi.id_venda = $1
        `, [id]);

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

// Criar nova venda
router.post('/', async (req, res) => {
    const {
        cpf_cliente,
        data_venda = new Date(),
        forma_pagamento,
        origem,
        itens,
        pagamentos
    } = req.body;

    if (!cpf_cliente || !forma_pagamento || !origem || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    // Calcular valor total considerando área (largura x altura) e mão de obra (20%)
    const valor_total = itens.reduce((sum, item) => {
        const area = (item.largura || 0) * (item.altura || 0);
        const valorItem = area * (item.valor_unitario || 0) * 1.2; // +20% mão de obra
        return sum + valorItem;
    }, 0);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Criar venda
        const vendaResult = await client.query(
            `INSERT INTO venda (
                data_venda,
                forma_pagamento,
                valor,
                origem,
                cpf_cliente
            ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [data_venda, forma_pagamento, valor_total, origem, cpf_cliente]
        );
        const id_venda = vendaResult.rows[0].id;

        // 2. Inserir itens com largura, altura e valor_total
        for (const item of itens) {
            const area = (item.largura || 0) * (item.altura || 0);
            const valorItem = area * (item.valor_unitario || 0) * 1.2;

            await client.query(
                `INSERT INTO venda_itens (
                    id_venda,
                    id_produto,
                    quantidade,
                    valor_unitario,
                    medida,
                    descricao,
                    largura,
                    altura,
                    valor_total
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    id_venda,
                    item.id_produto,
                    item.quantidade || 1,
                    item.valor_unitario,
                    item.medida,
                    item.descricao,
                    item.largura,
                    item.altura,
                    valorItem
                ]
            );
        }

        // 3. Pagamentos
        if (pagamentos && Array.isArray(pagamentos)) {
            for (const pagamento of pagamentos) {
                await client.query(
                    `INSERT INTO pagamentos (
                        id_venda,
                        data_pagamento,
                        valor_pago,
                        forma_pagamento,
                        status
                    ) VALUES ($1, $2, $3, $4, $5)`,
                    [id_venda, pagamento.data_pagamento || data_venda, pagamento.valor_pago, pagamento.forma_pagamento, pagamento.status || 'Confirmado']
                );
            }
        } else {
            await client.query(
                `INSERT INTO pagamentos (
                    id_venda,
                    data_pagamento,
                    valor_pago,
                    forma_pagamento,
                    status
                ) VALUES ($1, $2, $3, $4, $5)`,
                [id_venda, data_venda, valor_total, forma_pagamento, 'Confirmado']
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Venda criada com sucesso", venda: vendaResult.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: "Erro interno ao criar venda" });
    } finally {
        client.release();
    }
});

// Atualizar venda
router.put('/detalhes/:id', async (req, res) => {
    const { id } = req.params;
    const {
        forma_pagamento,
        origem,
        itens,
        pagamentos
    } = req.body;

    if (!forma_pagamento || !origem || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes ou inválidos" });
    }

    // Calcular valor total considerando área (largura x altura) e mão de obra (20%)
    const valor_total = itens.reduce((sum, item) => {
        const area = (item.largura || 0) * (item.altura || 0);
        const valorItem = area * (item.valor_unitario || 0) * 1.2; // +20% mão de obra
        return sum + valorItem;
    }, 0);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `UPDATE venda SET 
                forma_pagamento = $1, 
                origem = $2, 
                valor = $3 
             WHERE id = $4 RETURNING *`,
            [forma_pagamento, origem, valor_total, id]
        );

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Venda não encontrada" });
        }

        await client.query('DELETE FROM venda_itens WHERE id_venda = $1', [id]);
        for (const item of itens) {
            const area = (item.largura || 0) * (item.altura || 0);
            const valorItem = area * (item.valor_unitario || 0) * 1.2;

            await client.query(
                `INSERT INTO venda_itens (
                    id_venda,
                    id_produto,
                    quantidade,
                    valor_unitario,
                    medida,
                    descricao,
                    largura,
                    altura,
                    valor_total
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    id,
                    item.id_produto,
                    item.quantidade || 1,
                    item.valor_unitario,
                    item.medida,
                    item.descricao,
                    item.largura,
                    item.altura,
                    valorItem
                ]
            );
        }

        await client.query('DELETE FROM pagamentos WHERE id_venda = $1', [id]);
        if (pagamentos && Array.isArray(pagamentos)) {
            for (const pagamento of pagamentos) {
                await client.query(
                    `INSERT INTO pagamentos (
                        id_venda,
                        data_pagamento,
                        valor_pago,
                        forma_pagamento,
                        status
                    ) VALUES ($1, $2, $3, $4, $5)`,
                    [id, pagamento.data_pagamento, pagamento.valor_pago, pagamento.forma_pagamento, pagamento.status || 'Confirmado']
                );
            }
        } else {
            await client.query(
                `INSERT INTO pagamentos (
                    id_venda,
                    data_pagamento,
                    valor_pago,
                    forma_pagamento,
                    status
                ) VALUES ($1, $2, $3, $4, $5)`,
                [id, new Date(), valor_total, forma_pagamento, 'Confirmado']
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

// Deletar venda
router.delete('/detalhes/:id', async (req, res) => {
    const { id } = req.params;

    try {
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