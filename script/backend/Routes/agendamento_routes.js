const express = require('express');
const pool = require('../Db');
const { autenticar, somenteGerentes } = require('../middlewares/authMiddleware');
const { enviarEmail } = require('../services/EmailServices');

const router = express.Router();

// Criar agendamento - RF01
router.post('/', async (req, res) => {
    const {
        cpf_cliente,
        data,
        horario,
        observacoes
    } = req.body;

    if (!cpf_cliente || !data || !horario) {
        return res.status(400).json({ error: 'cpf_cliente, data e horario são obrigatórios' });
    }

    try {
        const cpf = cpf_cliente.toUpperCase().trim();

        // Verifica se o cliente existe
        const clienteResult = await pool.query(
            'SELECT nome, email FROM cliente WHERE cpf = $1',
            [cpf]
        );

        if (clienteResult.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado com o CPF informado' });
        }

        const nome_cliente = clienteResult.rows[0].nome;
        const emailCliente = clienteResult.rows[0].email;

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
            `INSERT INTO agendamento (data, horario, status, observacoes, cpf_cliente)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [data, horario, 'agendado', observacoes || null, cpf]
        );

        // Enviar email ao cliente
        if (emailCliente) {
            const assunto = 'Agendamento Criado com Sucesso';
            const texto = `Olá, ${nome_cliente}! Seu agendamento foi criado para o dia ${data} às ${horario}.`;
            const html = `<p>Olá, <b>${nome_cliente}</b>!</p><p>Seu agendamento foi criado para o dia <b>${data}</b> às <b>${horario}</b>.</p>`;
            enviarEmail(emailCliente, assunto, texto, html);
        }

        res.status(201).json({
            id_agendamento: result.rows[0].id,
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
    try {
        let query = `
            SELECT a.id, a.data, a.horario, a.status, a.observacoes, c.nome as nome_cliente, c.cpf as cpf_cliente
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

// Listar agendamento por ID - RF02
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT a.*, c.nome, c.cpf FROM agendamento a JOIN cliente c ON a.cpf_cliente = c.cpf WHERE a.id = $1',
            [id]
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
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, horario, observacoes } = req.body;

    if (!data || !horario) {
        return res.status(400).json({ error: 'Data e horário são obrigatórios para remarcar' });
    }

    try {
        // Verifica se o novo horário está disponível (exceto para o próprio agendamento)
        const existe = await pool.query(
            `SELECT * FROM agendamento
             WHERE data = $1 AND horario = $2 AND id <> $3`,
            [data, horario, id]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Novo horário já está agendado' });
        }

        // Atualiza agendamento
        const result = await pool.query(
            `UPDATE agendamento
             SET data = $1, horario = $2, observacoes = $3
             WHERE id = $4
             RETURNING id`,
            [data, horario, observacoes || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        // Pegar info do cliente para enviar email
        const agendamentoInfo = await pool.query(
            `SELECT c.email, c.nome FROM agendamento a JOIN cliente c ON a.cpf_cliente = c.cpf WHERE a.id = $1`,
            [id]
        );

        const emailCliente = agendamentoInfo.rows[0]?.email;
        const nomeCliente = agendamentoInfo.rows[0]?.nome;

        if (emailCliente) {
            const assunto = 'Agendamento Remarcado';
            const texto = `Olá, ${nomeCliente}! Seu agendamento foi remarcado para o dia ${data} às ${horario}.`;
            const html = `<p>Olá, <b>${nomeCliente}</b>!</p><p>Seu agendamento foi remarcado para o dia <b>${data}</b> às <b>${horario}</b>.</p>`;
            enviarEmail(emailCliente, assunto, texto, html);
        }

        res.json({
            id_agendamento: result.rows[0].id,
            message: 'Agendamento atualizado com sucesso'
        });
    } catch (err) {
        console.error('Erro ao remarcar agendamento:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Atualizar status do agendamento - RF05
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status é obrigatório' });
    }

    try {
        const result = await pool.query(
            `UPDATE agendamento
             SET status = $1
             WHERE id = $2
             RETURNING id, status`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }

        res.json({
            id_agendamento: result.rows[0].id,
            status: result.rows[0].status,
            message: 'Status atualizado com sucesso'
        });
    } catch (err) {
        console.error('Erro ao atualizar status do agendamento:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Cancelar agendamento - RF04
router.delete('/:id', autenticar, async (req, res) => {
    const { id } = req.params;
    const { tipo } = req.usuario; // 'gerente' ou 'usuario'

    try {
        const agendamento = await pool.query(
            `SELECT data, horario FROM agendamento WHERE id = $1`,
            [id]
        );

        if (agendamento.rows.length === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado' });
        }

        if (tipo !== 'gerente') {
            const agora = new Date();
            const [ano, mes, dia] = agendamento.rows[0].data.toISOString().split('T')[0].split('-');
            const [hora, minuto] = agendamento.rows[0].horario.split(':');
            const dataAgendamento = new Date(ano, mes - 1, dia, hora, minuto);

            const horasRestantes = (dataAgendamento - agora) / (1000 * 60 * 60);
            if (horasRestantes < 12) {
                return res.status(403).json({
                    erro: 'Cancelamento requer 12h de antecedência (para usuários comuns)'
                });
            }
        }

        // Buscar email e nome do cliente antes de deletar
        const agendamentoCliente = await pool.query(
            `SELECT c.email, c.nome, a.data, a.horario 
             FROM agendamento a JOIN cliente c ON a.cpf_cliente = c.cpf WHERE a.id = $1`,
            [id]
        );

        if (agendamentoCliente.rows.length === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado' });
        }

        const { email, nome, data, horario } = agendamentoCliente.rows[0];

        // Deleta o agendamento
        await pool.query('DELETE FROM agendamento WHERE id = $1', [id]);

        if (email) {
            const assunto = 'Agendamento Cancelado';
            const texto = `Olá, ${nome}! Seu agendamento para o dia ${data.toISOString().split('T')[0]} às ${horario} foi cancelado.`;
            const html = `<p>Olá, <b>${nome}</b>!</p><p>Seu agendamento para o dia <b>${data.toISOString().split('T')[0]}</b> às <b>${horario}</b> foi cancelado.</p>`;
            enviarEmail(email, assunto, texto, html);
        }

        res.json({ mensagem: 'Agendamento cancelado' });

    } catch (err) {
        console.error('Erro ao cancelar agendamento:', err);
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

module.exports = router;
