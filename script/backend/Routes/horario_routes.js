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

router.get('/horarios-disponiveis', async (req, res) => {
    const data = req.query.data;

    if (!data) {
        return res.status(400).json({ error: 'Parâmetro "data" é obrigatório no formato YYYY-MM-DD' });
    }

    try {
        // Busca os horários agendados para a data
        const agendamentosResult = await pool.query(
            'SELECT horario FROM agendamento WHERE data = $1',
            [data]
        );

        const horariosAgendados = agendamentosResult.rows.map(row => row.horario.substring(0, 5)); // pega "HH:MM"

        // Filtra os horários padrão que ainda não estão agendados
        const horariosDisponiveis = horariosPadrao.filter(h => !horariosAgendados.includes(h));

        res.json(horariosDisponiveis);
    } catch (err) {
        console.error('Erro ao buscar horários disponíveis:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
