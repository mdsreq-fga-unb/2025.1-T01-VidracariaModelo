import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
interface MesFinanceiro {
    mes: string;
    receita: number;
    despesa: number;
}

interface GraficoFinanceiroProps {
    dataInicio: string;
    dataFim: string;
    onResumoKpis?: (resumo: { total_receita: string; total_despesas: string; lucro_bruto: string }) => void;
}

const GraficoFinanceiro: React.FC<GraficoFinanceiroProps> = ({ dataInicio, dataFim, onResumoKpis }) => {

    const [dados, setDados] = useState<MesFinanceiro[]>([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_URL_BASE;

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const token = localStorage.getItem("token");

                const queryParams = new URLSearchParams();
                if (dataInicio) queryParams.append("data_inicio", dataInicio);
                if (dataFim) queryParams.append("data_fim", dataFim);

                const res = await fetch(`${API_URL}/dash/summary?${queryParams.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Erro ao buscar dados do dashboard');
                }

                const json = await res.json();
                setDados(json.grafico_financeiro_mensal);

                // Envia os KPIs para o Dashboard
                if (onResumoKpis) {
                    onResumoKpis(json.kpis);
                }

            } catch (error) {
                console.error("Erro:", error);
                alert("Não foi possível carregar os dados financeiros.");
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [dataInicio, dataFim]);

    if (loading) return <p>Carregando gráfico...</p>;

    return (
        <div style={{ width: '100%', height: 400 }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Receita vs. Despesa</h2>
            <ResponsiveContainer>
                <BarChart
                    data={dados}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="receita" fill="#4CAF50" name="Receita" />
                    <Bar dataKey="despesa" fill="#F44336" name="Despesa" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraficoFinanceiro;
