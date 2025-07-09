const express = require('express');
const pool = require('../Db');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints para gerenciamento de clientes
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cliente ORDER BY nome');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

/**
 * @swagger
 * /clientes/{cpf}:
 *   get:
 *     summary: Busca cliente pelo CPF
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
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

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *               - nome
 *             properties:
 *               cpf:
 *                 type: string
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: CPF e nome são obrigatórios
 *       409:
 *         description: Cliente com esse CPF já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', async (req, res) => {
    const { cpf, nome, telefone, endereco } = req.body;

    if (!cpf || !nome) {
        return res.status(400).json({ error: 'CPF e nome são obrigatórios' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO cliente (cpf, nome, telefone, endereco) VALUES ($1, $2, $3, $4) RETURNING *',
            [cpf, nome, telefone || null, endereco || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar cliente:', err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Cliente com esse CPF já existe' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

/**
 * @swagger
 * /clientes/{cpf}:
 *   put:
 *     summary: Atualiza dados de um cliente pelo CPF
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       400:
 *         description: Nome é obrigatório
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:cpf', async (req, res) => {
    const cpf = req.params.cpf;
    const { nome, telefone, endereco } = req.body;

    if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    try {
        const result = await pool.query(
            'UPDATE cliente SET nome = $1, telefone = $2, endereco = $3 WHERE cpf = $4 RETURNING *',
            [nome, telefone || null, endereco || null, cpf]
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

/**
 * @swagger
 * /clientes/{cpf}:
 *   delete:
 *     summary: Deleta um cliente pelo CPF
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *     responses:
 *       200:
 *         description: Cliente deletado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
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
