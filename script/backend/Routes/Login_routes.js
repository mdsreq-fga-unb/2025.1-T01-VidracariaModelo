const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../Db');

const router = express.Router();
const SECRET = 'seu_token_secreto';

/**
 * @swagger
 * tags:
 *   name: Administradores
 *   description: Gerenciamento dos administradores
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login de administrador
 *     tags: [Administradores]
 *     requestBody:
 *       description: Dados para autenticação
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: ana@vidracaria.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Ana Souza
 *                     tipo:
 *                       type: string
 *                       example: gerente
 *       401:
 *         description: Usuário não encontrado ou senha inválida
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await pool.query('SELECT * FROM administrador WHERE email = $1', [email]);

        if (result.rowCount === 0) {
            return res.status(401).json({ erro: 'Usuário não encontrado' });
        }

        const admin = result.rows[0];

        const senhaValida = bcrypt.compareSync(senha, admin.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha inválida' });
        }

        const token = jwt.sign({ id: admin.id }, SECRET, { expiresIn: '1h' });

        res.json({
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: {
                id: admin.id,
                nome: admin.nome,
                tipo: admin.tipo_usuario
            }
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Cadastrar um novo administrador
 *     tags: [Administradores]
 *     requestBody:
 *       description: Dados do administrador para cadastro
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - tipo_usuario
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Carlos Lima
 *               email:
 *                 type: string
 *                 example: carlos@vidracaria.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *               tipo_usuario:
 *                 type: string
 *                 enum: [gerente, usuario]
 *                 example: usuario
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Administrador criado
 *                 administrador:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     nome:
 *                       type: string
 *                       example: Carlos Lima
 *                     email:
 *                       type: string
 *                       example: carlos@vidracaria.com
 *                     tipo_usuario:
 *                       type: string
 *                       example: usuario
 *       400:
 *         description: Dados inválidos ou email já cadastrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', async (req, res) => {
    const { nome, email, senha, tipo_usuario } = req.body;

    // Validar campos básicos
    if (!nome || !email || !senha || !tipo_usuario) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    try {
        // Verificar se email já existe
        const emailExiste = await pool.query('SELECT id FROM administrador WHERE email = $1', [email]);
        if (emailExiste.rowCount > 0) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        // Criptografar senha
        const hashSenha = bcrypt.hashSync(senha, 8);

        // Inserir no banco
        const result = await pool.query(
            'INSERT INTO administrador (nome, email, senha, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo_usuario',
            [nome, email, hashSenha, tipo_usuario]
        );

        res.status(201).json({ mensagem: 'Administrador criado', administrador: result.rows[0] });
    } catch (err) {
        console.error('Erro ao criar administrador:', err);
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Listar todos os administradores
 *     tags: [Administradores]
 *     responses:
 *       200:
 *         description: Lista de administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     example: Ana Souza
 *                   email:
 *                     type: string
 *                     example: ana@vidracaria.com
 *                   tipo_usuario:
 *                     type: string
 *                     example: gerente
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nome, email, tipo_usuario FROM administrador ORDER BY nome');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao listar administradores:', err);
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

/**
 * @swagger
 * /auth/{id}:
 *   get:
 *     summary: Obter administrador pelo ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do administrador
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Administrador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: Ana Souza
 *                 email:
 *                   type: string
 *                   example: ana@vidracaria.com
 *                 tipo_usuario:
 *                   type: string
 *                   example: gerente
 *       404:
 *         description: Administrador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT id, nome, email, tipo_usuario FROM administrador WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ erro: 'Administrador não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar administrador:', err);
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

/**
 * @swagger
 * /auth/{id}:
 *   put:
 *     summary: Atualizar dados do administrador
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do administrador a atualizar
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: Dados para atualização do administrador
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - tipo_usuario
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Ana Souza
 *               email:
 *                 type: string
 *                 example: ana_novo@vidracaria.com
 *               tipo_usuario:
 *                 type: string
 *                 example: gerente
 *     responses:
 *       200:
 *         description: Administrador atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Administrador atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Administrador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, tipo_usuario } = req.body;

    if (!nome || !email || !tipo_usuario) {
        return res.status(400).json({ erro: 'Campos nome, email e tipo_usuario são obrigatórios' });
    }

    try {
        // Verificar se o administrador existe
        const adminExiste = await pool.query('SELECT id FROM administrador WHERE id = $1', [id]);
        if (adminExiste.rowCount === 0) {
            return res.status(404).json({ erro: 'Administrador não encontrado' });
        }

        // Atualizar dados
        await pool.query(
            'UPDATE administrador SET nome = $1, email = $2, tipo_usuario = $3 WHERE id = $4',
            [nome, email, tipo_usuario, id]
        );

        res.json({ mensagem: 'Administrador atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar administrador:', err);
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

/**
 * @swagger
 * /auth/{id}:
 *   delete:
 *     summary: Deletar administrador pelo ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do administrador a ser deletado
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Administrador deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Administrador deletado com sucesso
 *       404:
 *         description: Administrador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM administrador WHERE id = $1 RETURNING id', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ erro: 'Administrador não encontrado' });
        }

        res.json({ mensagem: 'Administrador deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar administrador:', err);
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

module.exports = router;
