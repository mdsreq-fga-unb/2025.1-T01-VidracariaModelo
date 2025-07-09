const express = require('express');
const pool = require('../Db');

const router = express.Router();

// Lista de horários padrão (ajuste conforme sua necessidade)
const horariosPadrao = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00'
];

/**
 * @swagger
 * tags:
 *   name: Horários
 *   description: Endpoints para gerenciamento de agendamentos
 */

/**
 * @swagger
 * /Horários/horarios-disponiveis:
 *   get:
 *     summary: Lista horários disponíveis para uma data específica
 *     tags: [Horários]
 *     parameters:
 *       - in: query
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data no formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Lista de horários disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "08:00"
 *       400:
 *         description: Parâmetro obrigatório ausente ou inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/horarios-disponiveis', async (req, res) => {
    const data = req.query.data;

    if (!data) {
        return res.status(400).json({ error: 'Parâmetro "data" é obrigatório no formato YYYY-MM-DD' });
    }

    try {
        // Busca os horários já agendados para a data informada
        const agendamentosResult = await pool.query(
            'SELECT horario FROM agendamento WHERE data = $1',
            [data]
        );

        // Transforma o resultado em um array com apenas os horários no formato "HH:MM"
        const horariosAgendados = agendamentosResult.rows.map(row => row.horario.substring(0, 5));

        // Filtra os horários padrão que ainda não estão agendados
        const horariosDisponiveis = horariosPadrao.filter(h => !horariosAgendados.includes(h));

        // Retorna os horários disponíveis
        res.json(horariosDisponiveis);
    } catch (err) {
        console.error('Erro ao buscar horários disponíveis:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
