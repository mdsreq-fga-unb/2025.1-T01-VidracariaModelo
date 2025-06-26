const express = require('express');
const pool = require('../Db');

const router = express.Router();

router.get('/horarios-disponiveis', async (req, res) => {
    const data = req.query.data;

    if (!data) {
        return res.status(400).json({ error: 'Parâmetro data é obrigatório, formato YYYY-MM-DD' });
    }

    try {
        const horariosResult = await pool.query('SELECT id_horario, horario_inicio, horario_fim FROM horarios_disponiveis ORDER BY horario_inicio');
        const agendamentosResult = await pool.query(
            'SELECT horario FROM agendamentos WHERE data = $1',
            [data]
        );

        const horariosAgendados = agendamentosResult.rows.map(a => a.horario);
        const horariosDisponiveis = horariosResult.rows.filter(h => {
            return !horariosAgendados.includes(h.horario_inicio);
        });

        res.json(horariosDisponiveis);
    } catch (err) {
        console.error('Erro ao buscar horários disponíveis:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
