import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DuvidaItem from '../components/Listar_DuvidaItem';
import './ListarDuvida.css';

interface Duvida {
  id: number;
  duvida: string;
  resposta: string;
}

const getUsuarioFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    return JSON.parse(atob(payloadBase64)) as { id: number; tipo_usuario: string };
  } catch {
    return null;
  }
};

const ListarDuvidas: React.FC = () => {
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const navigate = useNavigate();

  const usuarioLogado = getUsuarioFromToken();

  // 2. Criar uma variável booleana para deixar o código no JSX mais limpo.
  const isGerente = usuarioLogado?.tipo_usuario === 'gerente';

  const handleCriarDuvida = () => navigate("/duvida/criar");

  // 3. O useEffect agora tem a única responsabilidade de buscar os dados.
  useEffect(() => {
    const buscarDuvidas = async () => {
      try {
        const res = await fetch('http://localhost:3000/duvidas');

        // Esta verificação de token expirado está ótima!
        if (res.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setDuvidas(data);

      } catch (err) {
        console.error("Erro ao buscar duvidas:", err);
        alert('Erro ao carregar duvidas');
      }
    };

    buscarDuvidas();
  }, [navigate]); // O array de dependências está correto.


  return (
    <div className="page-container">
      <main className="main-content">
        <div className="cabecalho-lista">
          <h1 className="page-title">Lista de Dúvidas</h1>
          
          {/* 4. RENDERIZAÇÃO CONDICIONAL do botão */}
          {/* O botão só será exibido se a variável 'isGerente' for verdadeira. */}
          {isGerente && (
            <button className="botao-novo" onClick={handleCriarDuvida}>
              + Nova Dúvida
            </button>
          )}
        </div>
       
        <div className="lista-container">
          {duvidas.map(duvida => (
            <DuvidaItem
              key={duvida.id} 
              id={duvida.id}
              duvida={duvida.duvida}
              resposta={duvida.resposta}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ListarDuvidas;