const express = require('express');
const pool = require('../Db');

const router = express.Router();

// Lista de horários padrão (ajuste conforme sua necessidade)
const horariosPadrao = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
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

        const horariosAgendados = agendamentosResult.rows.map(row => row.horario.substring(0, 5)); // ex: "08:00"

        const intervaloMinutos = 90;

        // Função que converte "HH:MM" para minutos desde meia-noite
        const converterParaMinutos = (hora) => {
            const [h, m] = hora.split(':').map(Number);
            return h * 60 + m;
        };

        // Filtra os horários padrão que respeitam o intervalo mínimo
        const horariosDisponiveis = horariosPadrao.filter(horario => {
            const horarioMin = converterParaMinutos(horario);

            // Verifica se existe algum agendamento que esteja a menos de 30 minutos deste horário
            const conflito = horariosAgendados.some(agend => {
                const agendMin = converterParaMinutos(agend);
                return Math.abs(horarioMin - agendMin) < intervaloMinutos;
            });

            return !conflito; // mantém apenas horários que NÃO têm conflito
        });

        res.json(horariosDisponiveis);
    } catch (err) {
        console.error('Erro ao buscar horários disponíveis:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


module.exports = router;
