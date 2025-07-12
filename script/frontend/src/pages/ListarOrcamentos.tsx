import React, { useEffect, useState } from 'react';
import OrcamentoItem from '../components/OrcamentoItem';
import './ListarOrcamentos.css';

interface Orcamento {
  id: number;
  data_solicitacao: string;
  status: string;
  observacoes: string;
  cliente_nome: string;
  cliente_cpf: string;
}

const ListarOrcamentos: React.FC = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarOrcamentos = async () => {
      try {
        const res = await fetch('http://localhost:3000/orcamento');
        if (!res.ok) {
          throw new Error('Erro ao buscar orçamentos');
        }

        const data = await res.json();
        setOrcamentos(data);
      } catch (err: any) {
        console.error(err);
        setErro('Erro ao carregar orçamentos');
      } finally {
        setCarregando(false);
      }
    };

    buscarOrcamentos();
  }, []);

  return (
    <div className="page-container">
      <main className="main-content">
        <h1 className="page-title">Lista de orçamentos solicitados</h1>

        {carregando && <p>Carregando orçamentos...</p>}
        {erro && <p className="erro">{erro}</p>}

        <div className="orcamentos-list">
          {orcamentos.map((orcamento) => (
            <OrcamentoItem
              key={orcamento.id}
              id={orcamento.id}
              titulo={`${orcamento.cliente_nome} - ${orcamento.status}`}
              subtitulo={orcamento.observacoes}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ListarOrcamentos;
