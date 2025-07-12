import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './Editar_Duvidas.css';
import { useNavigate, useParams } from 'react-router-dom';

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

const PaginaDeDuvidas: React.FC = () => {
  const [duvida_desc, setDuvida] = useState('');
  const [resposta, setResposta] = useState('');
  const [carregando, setCarregando] = useState(true); 

  const { id } = useParams();
  const navigate = useNavigate();

  // --- LÓGICA DO BOTÃO "SALVAR" ---
  // Corrigido para receber o evento e prevenir o comportamento padrão do form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    
    const duvida = {
      duvida: duvida_desc,
      resposta: resposta,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/duvidas/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(duvida),
      });

      if (!res.ok) throw new Error('Erro ao atualizar');

      alert('Dúvida atualizada com sucesso!');
      navigate('/duvidas/listar');
    } catch (err) {
      alert('Erro ao salvar alterações.');
    }
  };

  // --- LÓGICA DO BOTÃO "EXCLUIR" ---
  const handleExcluirClick = async () => {
    const confirmar = window.confirm("Você tem certeza que deseja excluir esta dúvida?");
    if (!confirmar || !id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/duvidas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Erro ao excluir');

      alert("Dúvida excluída!");
      navigate('/duvidas/listar');
    } catch (err) {
      alert('Erro ao excluir duvida');
    }
  };

  useEffect(() => {
    // 1. PRIMEIRO, VERIFICAR A PERMISSÃO
    const usuario = getUsuarioFromToken();
    if (!usuario || usuario.tipo_usuario !== 'gerente') {
        alert("Acesso negado. Você precisa ser um gerente para editar dúvidas.");
        navigate('/duvidas/listar');
        return; // Interrompe a execução se o usuário não tiver permissão
    }

    // 2. SE TIVER PERMISSÃO, BUSCAR OS DADOS DA DÚVIDA
    const buscarDuvida = async () => {
      if (!id) return;

      try {
        const res = await fetch(`http://localhost:3000/duvidas/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar dúvida");

        const data = await res.json();
        setDuvida(data.duvida);
        setResposta(data.resposta);
      } catch (err) {
        alert("Erro ao carregar dúvida.");
        console.error(err);
        navigate('/duvidas/listar');
      } finally {
        // 3. FINALIZA O CARREGAMENTO, INDEPENDENTE DE SUCESSO OU FALHA
        setCarregando(false);
      }
    };

    buscarDuvida();
  }, [id, navigate]); // Adicionado navigate ao array de dependências

  if (carregando) {
    return <div>Carregando...</div>;
  }

  // O JSX FICA AQUI, NO CORPO PRINCIPAL DO COMPONENTE
  return (
    <>
      <div className="agendamento-container">
        <button
          type="button"
          className="voltar-button"
          onClick={() => navigate('/duvidas/listar')}
        >
          ← Voltar
        </button>

        <h1 className="agendamento-titulo">Editar Dúvida</h1>
        <form className="agendamento-form" onSubmit={handleSubmit}>
          {/* Campo Duvida */}
          <div className="form-group">
            <label htmlFor="duvida">Dúvida:</label>
            <textarea id="duvida" className="textarea-field" value={duvida_desc} onChange={(e) => setDuvida(e.target.value)} />
          </div>

          {/* Campo Resposta */}
          <div className="form-group">
            <label htmlFor="resposta">Resposta:</label>
            <textarea id="resposta" className="textarea-field" value={resposta} onChange={(e) => setResposta(e.target.value)} />
          </div>          

          <div className="botoes-container">
            <button type="button" className="excluir-button" onClick={handleExcluirClick}>
              Excluir
            </button>
            <button type="submit" className="salvar-button">
              Salvar
            </button>
          </div>
        </form>
      </div >

      <footer className="footerContainer1">
        <div className="redStripe1" />
      </footer>
    </>
  );
};

export default PaginaDeDuvidas;