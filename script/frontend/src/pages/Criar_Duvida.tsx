import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import './Criar_Duvida.css';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

// 1. FUNÇÃO PARA PEGAR E DECODIFICAR O TOKEN
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
  const [duvida, setDuvida] = useState<string>('');
  const [resposta, setResposta] = useState<string>('');
  // Adicionado para evitar que o formulário apareça rapidamente antes do redirect
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_URL_BASE;
  // 2. useEffect PARA VERIFICAR A PERMISSÃO AO CARREGAR A PÁGINA
  useEffect(() => {
    const usuario = getUsuarioFromToken();

    // Se não houver usuário ou se ele não for um gerente...
    if (!usuario || usuario.tipo_usuario !== 'gerente') {
      alert("Acesso negado. Apenas gerentes podem criar novas dúvidas.");
      navigate('/duvidas/listar'); // Redireciona para a página de listagem
    } else {
      // Se tiver permissão, para de carregar e mostra o formulário
      setCarregando(false);
    }
  }, [navigate]); // navigate é uma dependência do useEffect


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!duvida || !resposta) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (duvida.length <= 10) {
      alert('Por favor, descreva melhor a dúvida!');
      return;
    }
    if (resposta.length <= 20) {
      alert('Por favor, descreva melhor a resposta!');
      return;
    }

    try {
      const duvidas = {
        duvida: duvida,
        resposta: resposta,
      };


      const token = localStorage.getItem("token"); // Pega o token para autenticação

      const res = await fetch(`${API_URL}/duvidas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 3. ADICIONAR O TOKEN DE AUTORIZAÇÃO
          // Essencial para o backend saber quem está fazendo a requisição
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(duvidas),
      });

      if (!res.ok) {
        const erro = await res.json();
        alert(erro.error || 'Erro ao criar dúvida');
        return;
      }

      alert('Dúvida criada com sucesso!');
      setDuvida('');
      setResposta('');
      navigate('/duvidas/listar');
    } catch (error) {
      alert('Erro ao criar dúvida');
    }
  };

  // Se estiver verificando as permissões, mostra uma tela de carregamento
  if (carregando) {
    return <div>Verificando permissões...</div>;
  }

  // O formulário só é renderizado se o usuário for um gerente
  return (
    <>
      <div className="agendamento-container">
        <button
          type="button"
          className="voltar-button" // Usando uma classe genérica de voltar
          onClick={() => navigate('/duvidas/listar')}
        >
          ← Voltar
        </button>

        <h1 className="agendamento-titulo">Criar Nova Dúvida</h1>
        <Form className="agendamento-form" onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Dúvida:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={duvida}
              onChange={(e) => setDuvida(e.target.value)}
              placeholder="Digite aqui a dúvida do cliente..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Resposta:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={resposta}
              onChange={(e) => setResposta(e.target.value)} // <-- CORRIGIDO
              placeholder="Digite a resposta padrão para esta dúvida..."
            />
          </Form.Group>

          <Button type="submit" className="agendar-button">Salvar Dúvida</Button>
        </Form>
      </div>
      <footer className="footerContainer1">
        <div className="redStripe1" />
      </footer>
    </>
  );
};

export default PaginaDeDuvidas;