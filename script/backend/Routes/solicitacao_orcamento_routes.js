const express = require('express');
const pool = require('../Db');
const router = express.Router();

// [CLIENTE] - Criar nova solicitação de orçamento
router.post('/', async (req, res) => {
    const { cpf_cliente, observacoes, itens } = req.body;

    if (!cpf_cliente || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes: cpf_cliente e itens." });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Inserir o cabeçalho da solicitação
        const solicitacaoResult = await client.query(
            `INSERT INTO solicitacao_orcamento (cpf_cliente, observacoes, status)
             VALUES ($1, $2, 'Pendente') RETURNING id`,
            [cpf_cliente, observacoes]
        );
        const id_solicitacao = solicitacaoResult.rows[0].id;

        // 2. Inserir os itens da solicitação
        for (const item of itens) {
            if (!item.id_produto || !item.largura || !item.altura) {
                throw new Error('Cada item deve conter id_produto, largura e altura.');
            }
            await client.query(
                `INSERT INTO solicitacao_orcamento_itens (id_solicitacao, id_produto, largura, altura, quantidade, observacoes)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    id_solicitacao,
                    item.id_produto,
                    item.largura,
                    item.altura,
                    item.quantidade || 1,
                    item.observacoes
                ]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Solicitação de orçamento criada com sucesso!", id_solicitacao });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: "Erro interno ao criar solicitação de orçamento.", details: error.message });
    } finally {
        client.release();
    }
});

// [ADMIN] - Listar todas as solicitações de orçamento com filtros
router.get('/', async (req, res) => {
    const { status, cpf_cliente, data_inicio, data_fim } = req.query;

    let query = `
        SELECT s.id, s.data_solicitacao, s.status, s.observacoes, c.nome as cliente_nome, c.cpf as cliente_cpf
        FROM solicitacao_orcamento s
        JOIN cliente c ON s.cpf_cliente = c.cpf
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (status) {
        query += ` AND s.status ILIKE $${paramIndex++}`;
        params.push(`%${status}%`);
    }
    if (cpf_cliente) {
        query += ` AND s.cpf_cliente = $${paramIndex++}`;
        params.push(cpf_cliente);
    }
    if (data_inicio) {
        query += ` AND s.data_solicitacao >= $${paramIndex++}`;
        params.push(data_inicio);
    }
    if (data_fim) {
        query += ` AND s.data_solicitacao <= $${paramIndex++}`;
        params.push(data_fim);
    }

    query += ` ORDER BY s.data_solicitacao DESC`;

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// [ADMIN] - Buscar uma solicitação de orçamento pelo ID com seus itens
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const solicitacaoQuery = pool.query(`
            SELECT s.*, c.nome as cliente_nome, c.email as cliente_email, c.endereco as cliente_endereco
            FROM solicitacao_orcamento s
            JOIN cliente c ON s.cpf_cliente = c.cpf
            WHERE s.id = $1
        `, [id]);

        const itensQuery = pool.query(`
            SELECT si.*, p.nome as produto_nome, p.valor_m2
            FROM solicitacao_orcamento_itens si
            JOIN produto p ON si.id_produto = p.id
            WHERE si.id_solicitacao = $1
        `, [id]);

        const [solicitacaoResult, itensResult] = await Promise.all([solicitacaoQuery, itensQuery]);

        if (solicitacaoResult.rows.length === 0) {
            return res.status(404).json({ error: "Solicitação de orçamento não encontrada" });
        }

        const solicitacao = solicitacaoResult.rows[0];
        const itens = itensResult.rows;

        let valor_total_calculado = 0;

        // Calcula o valor de cada item e o total
        solicitacao.itens = itens.map(item => {
            const valor_item = parseFloat(item.largura) * parseFloat(item.altura) * parseFloat(item.valor_m2) * item.quantidade;
            valor_total_calculado += valor_item;
            return {
                ...item,
                valor_item_calculado: valor_item.toFixed(2)
            };
        });

        solicitacao.valor_total_calculado = valor_total_calculado.toFixed(2);

        res.json(solicitacao);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// [ADMIN] - Atualizar uma solicitação de orçamento (status e itens)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, observacoes, itens, valor_ofertado } = req.body;

    if (!status || !Array.isArray(itens)) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes: status e itens." });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Atualizar o cabeçalho
        await client.query(
            `UPDATE solicitacao_orcamento SET status = $1, observacoes = $2, valor_ofertado = $3 WHERE id = $4`,
            [status, observacoes, valor_ofertado, id]
        );

        // 2. Deletar itens antigos
        await client.query(`DELETE FROM solicitacao_orcamento_itens WHERE id_solicitacao = $1`, [id]);

        // 3. Inserir novos itens
        for (const item of itens) {
            if (!item.id_produto || !item.largura || !item.altura) {
                throw new Error('Cada item deve conter id_produto, largura e altura.');
            }
            await client.query(
                `INSERT INTO solicitacao_orcamento_itens (id_solicitacao, id_produto, largura, altura, quantidade, observacoes)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [id, item.id_produto, item.largura, item.altura, item.quantidade || 1, item.observacoes]
            );
        }

        await client.query('COMMIT');
        res.json({ message: "Solicitação de orçamento atualizada com sucesso!" });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: "Erro interno ao atualizar solicitação.", details: error.message });
    } finally {
        client.release();
    }
});

// [ADMIN] - Deletar uma solicitação de orçamento
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // A exclusão em cascata (ON DELETE CASCADE) na FK irá remover os itens automaticamente
        const result = await pool.query('DELETE FROM solicitacao_orcamento WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Solicitação de orçamento não encontrada" });
        }

        res.json({ message: "Solicitação de orçamento deletada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno ao deletar solicitação" });
    }
});

module.exports = router;