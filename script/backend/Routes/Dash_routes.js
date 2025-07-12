const express = require('express');
const pool = require('../Db');
const { autenticar, somenteGerentes } = require('../middlewares/authMiddleware');
const router = express.Router();



router.get('/summary', async (req, res) => {
    const { data_inicio, data_fim } = req.query;

    try {
        const params = [data_inicio || null, data_fim || null];

        // Query 1: KPIs de Vendas (Receitas)
        const vendasQuery = pool.query(`
            SELECT COALESCE(SUM(valor), 0) as total_receita, COUNT(id) as numero_vendas
            FROM venda
            WHERE ($1::DATE IS NULL OR data_venda >= $1::DATE) AND ($2::DATE IS NULL OR data_venda <= $2::DATE)
        `, params);

        // Query 2: KPIs de Despesas
        const despesasQuery = pool.query(`
            SELECT COALESCE(SUM(valor), 0) as total_despesas
            FROM despesa
            WHERE ($1::DATE IS NULL OR data_despesa >= $1::DATE) AND ($2::DATE IS NULL OR data_despesa <= $2::DATE)
        `, params);

        // Query 3: Receitas por Mês (últimos 12 meses)
        const receitasPorMesQuery = pool.query(`
            SELECT TO_CHAR(data_venda, 'YYYY-MM') as mes, SUM(valor) as total_receita
            FROM venda
            WHERE data_venda >= (CURRENT_DATE - INTERVAL '12 months')
            GROUP BY mes ORDER BY mes ASC
        `);

        // Query 4: Despesas por Mês (últimos 12 meses)
        const despesasPorMesQuery = pool.query(`
            SELECT TO_CHAR(data_despesa, 'YYYY-MM') as mes, SUM(valor) as total_despesa
            FROM despesa
            WHERE data_despesa >= (CURRENT_DATE - INTERVAL '12 months')
            GROUP BY mes ORDER BY mes ASC
        `);

        // ... (outras queries como orçamentos e produtos mais vendidos)

        const [
            vendasResult,
            despesasResult,
            receitasPorMesResult,
            despesasPorMesResult
            // ... (outros resultados)
        ] = await Promise.all([
            vendasQuery, despesasQuery, receitasPorMesQuery, despesasPorMesQuery
            // ... (outras promises)
        ]);

        // Processa os resultados
        const { total_receita } = vendasResult.rows[0];
        const { total_despesas } = despesasResult.rows[0];
        const lucro_bruto = total_receita - total_despesas;

        // Gráfico Financeiro Mensal (Receita vs. Despesa)
        const financasMensais = {};
        receitasPorMesResult.rows.forEach(row => {
            if (!financasMensais[row.mes]) financasMensais[row.mes] = { mes: row.mes, receita: 0, despesa: 0 };
            financasMensais[row.mes].receita = parseFloat(row.total_receita);
        });
        despesasPorMesResult.rows.forEach(row => {
            if (!financasMensais[row.mes]) financasMensais[row.mes] = { mes: row.mes, receita: 0, despesa: 0 };
            financasMensais[row.mes].despesa = parseFloat(row.total_despesa);
        });
        const grafico_financeiro_mensal = Object.values(financasMensais).sort((a, b) => a.mes.localeCompare(b.mes));

        res.json({
            kpis: {
                total_receita: parseFloat(total_receita).toFixed(2),
                total_despesas: parseFloat(total_despesas).toFixed(2),
                lucro_bruto: lucro_bruto.toFixed(2),
                // ... outros kpis
            },
            grafico_financeiro_mensal,
            // ... outros dados do dashboard
        });

    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
