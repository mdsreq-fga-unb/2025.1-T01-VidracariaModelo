import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { ptBR } from 'date-fns/locale/pt-BR';
import './Agendamentos.css';
import { Form } from 'react-bootstrap';

interface Agendamento {
  id: number;
  cliente: string; // nome do cliente
  inicio: Date;
  fim: Date;
  observacoes?: string;
  status?: string;
}

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const Agendamentos: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<Date>();
  const [view, setView] = useState<View>('month');
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Agendamento | null>(null);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [acaoPendente, setAcaoPendente] = useState<'editar' | 'excluir' | null>(null);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');


  const navigate = useNavigate();

  // Função para criar uma data local correta usando data (YYYY-MM-DD) e horário (HH:mm:ss)
  const criarDataLocal = (dataISO: string, horario: string): Date => {
    // dataISO: "2025-07-15T03:00:00.000Z" -> queremos só a parte YYYY-MM-DD
    const dataParte = dataISO.slice(0, 10); // "2025-07-15"
    // Monta string ISO local com horário correto
    return new Date(`${dataParte}T${horario}`);
  };

  // Extrair usuário do token JWT armazenado no localStorage
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

  // Obter usuário logado para lógica interna
  const usuarioLogado = getUsuarioFromToken() ?? { tipo_usuario: '', id: -1 };

  // Filtragem e ordenação dos agendamentos
  const agendamentosFiltrados = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + 7);

    return agendamentos
      .filter(ag => {
        if (!dataSelecionada) {
          if (usuarioLogado.tipo_usuario !== 'gerente') {
            const limitePassado = new Date();
            limitePassado.setMonth(limitePassado.getMonth() - 12);
            if (ag.inicio < limitePassado) return false;
          }
          return ag.inicio >= hoje && ag.inicio <= limite;
        } else {
          const inicioDia = new Date(dataSelecionada);
          inicioDia.setHours(0, 0, 0, 0);
          const fimDia = new Date(dataSelecionada);
          fimDia.setHours(23, 59, 59, 999);
          return ag.inicio >= inicioDia && ag.inicio <= fimDia;
        }
      })
      .filter(ag => ag.cliente.toLowerCase().includes(filtroCliente.toLowerCase()))
      .filter(ag => {
        if (!filtroStatus) return true;
        return ag.status?.toLowerCase() === filtroStatus.toLowerCase();
      })
      .sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
  }, [agendamentos, filtroCliente, dataSelecionada, filtroStatus, usuarioLogado.tipo_usuario]);

  // Formatação de hora para exibição
  const formatarHora = (data: Date): string => format(data, 'HH:mm');

  // Manipuladores para calendário
  const handleSelecionarSlot = (slotInfo: { start: Date }) => setDataSelecionada(slotInfo.start);
  const handleNavegacao = (novaData: Date) => setDataSelecionada(novaData);
  const handleView = (novaView: View) => setView(novaView);

  // Estilo dos eventos baseado no status
  const eventPropGetter = (event: Agendamento) => {
    let backgroundColor = 'gray';
    if (event.status) {
      switch (event.status.toLowerCase()) {
        case 'concluido': backgroundColor = '#28a745'; break;
        case 'cancelado': backgroundColor = '#dc3545'; break;
        case 'agendado': backgroundColor = '#007bff'; break;
        case 'confirmado': backgroundColor = '#17a2b8'; break; // Adicionei esse status que apareceu no seu JSON
      }
    }
    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        padding: '2px 5px',
      }
    };
  };

  // Navegar para criação de agendamento
  const handleCriarAgendamento = () => navigate("/agendamento/criar");

  // Ao clicar em um evento abrir modal com detalhes
  const handleSelectEvent = (evento: Agendamento) => {
    setEventoSelecionado(evento);
    setModalAberto(true);
  };

  // Fechar todos os modais/confirmacoes
  const fecharTudo = () => {
    setModalAberto(false);
    setConfirmacaoAberta(false);
    setEventoSelecionado(null);
    setAcaoPendente(null);
  };

  // Verifica se usuário pode editar um agendamento
  const podeEditar = () => {
    if (!eventoSelecionado) return false;
    const agora = new Date();
    const isGerente = usuarioLogado.tipo_usuario === 'gerente';
    return eventoSelecionado.inicio > agora && isGerente;
  };

  // Handler para iniciar edição (abre confirmação)
  const handleEditar = () => {
    if (!podeEditar()) {
      alert("Você não tem permissão para remarcar este agendamento.");
      return;
    }
    setAcaoPendente('editar');
    setConfirmacaoAberta(true);
  };

  // Handler para iniciar exclusão (abre confirmação)
  const handleExcluir = () => {
    if (!eventoSelecionado) return;

    const agora = new Date();
    const diferencaHoras = (eventoSelecionado.inicio.getTime() - agora.getTime()) / (1000 * 60 * 60);

    if (usuarioLogado.tipo_usuario !== 'gerente' && diferencaHoras < 12) {
      alert("Cancelamento só é permitido com 12 horas de antecedência para usuários comuns.");
      return;
    }

    if (eventoSelecionado.inicio < agora) {
      alert("Não é possível cancelar agendamentos passados.");
      return;
    }

    setAcaoPendente('excluir');
    setConfirmacaoAberta(true);
  };

  // Cancelar confirmação
  const handleCancelarAcao = () => {
    setConfirmacaoAberta(false);
    setAcaoPendente(null);
  };

  // Confirmar edição ou exclusão
  const handleConfirmarAcao = async () => {
    if (!eventoSelecionado || !acaoPendente) return;

    if (acaoPendente === 'editar') {
      navigate(`/agendamento/editar/${eventoSelecionado.id}`);
    } else if (acaoPendente === 'excluir') {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Sessão expirada. Faça login novamente.");
          navigate("/login");
          return;
        }

        const res = await fetch(`http://localhost:3000/agendamentos/${eventoSelecionado.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!res.ok) {
          const erro = await res.json();
          alert(erro.erro || erro.error || 'Erro ao excluir agendamento');
          return;
        }

        setAgendamentos(agendamentos.filter(ag => ag.id !== eventoSelecionado.id));
        alert("Agendamento excluído com sucesso!");
      } catch (err) {
        console.error("Erro na requisição:", err);
        alert('Erro ao tentar excluir o agendamento');
      } finally {
        fecharTudo();
      }
    }
  };

  // Alterar status do agendamento (agendado -> concluido -> cancelado)
  const handleMudarStatus = async () => {
    if (!eventoSelecionado) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }

    const statusAtual = eventoSelecionado.status?.toLowerCase();
    const novoStatus = statusAtual === 'agendado' ? 'concluido'
      : statusAtual === 'concluido' ? 'cancelado' : 'agendado';

    try {
      const res = await fetch(`http://localhost:3000/agendamentos/${eventoSelecionado.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!res.ok) {
        const erro = await res.json();
        alert(erro.error || 'Erro ao atualizar status');
        return;
      }

      setAgendamentos(agendamentos.map(ag =>
        ag.id === eventoSelecionado.id ? { ...ag, status: novoStatus } : ag
      ));
      setEventoSelecionado({ ...eventoSelecionado, status: novoStatus });
      alert(`Status alterado para "${novoStatus}"`);
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert('Erro ao tentar atualizar o status');
    }
  };

  // Buscar agendamentos ao carregar componente
  useEffect(() => {
    const buscarAgendamentos = async () => {
      try {
        const res = await fetch('http://localhost:3000/agendamentos');

        if (res.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          navigate("/login");
          return;
        }

        const data = await res.json();

        const ags: Agendamento[] = data.map((item: any) => {
          const inicio = criarDataLocal(item.data, item.horario);
          const fim = new Date(inicio.getTime() + 60 * 60 * 1000); // duração 1h

          return {
            id: item.id,
            cliente: item.nome_cliente, // corrigido para nome_cliente
            inicio,
            fim,
            observacoes: item.observacoes,
            status: item.status,
          };
        });

        setAgendamentos(ags);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        alert('Erro ao carregar agendamentos');
      }
    };

    buscarAgendamentos();
  }, [navigate]);

  // Resetar filtro de data
  const resetarSelecao = () => {
    setDataSelecionada(undefined);
    setFiltroStatus('');
  }

  // Título para lista lateral de agendamentos
  const tituloLista = () => {
    if (!dataSelecionada) {
      const hoje = new Date();
      const limite = new Date();
      limite.setDate(hoje.getDate() + 7);
      return `${format(hoje, 'dd/MM/yyyy')} até ${format(limite, 'dd/MM/yyyy')}`;
    } else {
      return `Dia ${format(dataSelecionada, 'dd/MM/yyyy')}`;
    }
  };

  return (
    <div className="container-geral">
      <div className="painel-agendamentos">
        <header className="cabecalho">
          <h1>Agendamentos</h1>
          <button className="botao-novo-agendamento" onClick={handleCriarAgendamento}>+ Novo agendamento</button>
        </header>

        <input
          type="text"
          placeholder="Buscar por cliente"
          className="campo-busca"
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
        />

        <main className="conteudo-principal">
          <div className="painel-esquerdo">
            <div className="lista-agendamentos-container">
              <h2>{tituloLista()}</h2>

              <Form.Group className="mb-3">
                <Form.Label>Status do Agendamento</Form.Label>
                <Form.Select
                  id="status"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                >


                  <option value="agendado">Agendado</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </Form.Select>
              </Form.Group>


              <div className="d-flex justify-content-center">
                <button className="btn btn-sm btn-warning botao-resetar" onClick={resetarSelecao}>
                  Mostrar todos
                </button>
              </div>

              <ul className="lista-agendamentos">
                {agendamentosFiltrados.length > 0 ? (
                  agendamentosFiltrados.map((ag) => {
                    const marcadorClasse = ag.status?.toLowerCase() !== 'concluido' ? 'marcador-vermelho' : 'marcador-verde';
                    return (
                      <li key={ag.id} className="item-agendamento">
                        <div className="info-agendamento">
                          <span>{format(ag.inicio, 'dd/MM/yyyy')}</span>
                          <span>{ag.cliente}</span>
                          <span>{`${formatarHora(ag.inicio)} - ${formatarHora(ag.fim)}`}</span>
                        </div>
                        <span className={marcadorClasse}></span>
                      </li>
                    );
                  })
                ) : (
                  <p className="sem-agendamentos">Nenhum agendamento para este dia.</p>
                )}
              </ul>
            </div>
          </div>

          <div className="painel-direito">
            <Calendar
              localizer={localizer}
              events={agendamentosFiltrados}
              startAccessor="inicio"
              endAccessor="fim"
              titleAccessor="cliente"
              style={{ height: '100%', width: '100%' }}
              culture="pt-BR"
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento"
              }}
              onSelectSlot={handleSelecionarSlot}
              selectable
              eventPropGetter={eventPropGetter}
              date={dataSelecionada}
              onNavigate={handleNavegacao}
              view={view}
              onView={handleView}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </main>
      </div>

      {/* MODAL */}
      {modalAberto && eventoSelecionado && (
        <div className="modal-backdrop" onClick={fecharTudo}>
          <div className="modal-content bg-white" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Agendamento</h2>
            <div className="modal-body">
              <p><strong>Cliente:</strong> {eventoSelecionado.cliente}</p>
              <p><strong>Data:</strong> {format(eventoSelecionado.inicio, 'dd/MM/yyyy')}</p>
              <p><strong>Horário:</strong> {format(eventoSelecionado.inicio, 'HH:mm')}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span style={{ color: eventoSelecionado.status?.toLowerCase() === 'concluido' ? 'green' : 'inherit', fontWeight: 'bold' }}>
                  {eventoSelecionado.status}
                </span>
              </p>
              {eventoSelecionado.observacoes && <p><strong>Serviço:</strong> {eventoSelecionado.observacoes}</p>}
            </div>

            <button className="btn btn-warning w-50 d-block mx-auto" onClick={handleMudarStatus}>Alterar status</button>

            <div className="modal-footer">
              {podeEditar() && <button className="modal-button-edit" onClick={handleEditar}>Editar</button>}
              <button className="modal-button-delete" onClick={handleExcluir}>Excluir</button>
            </div>

            {confirmacaoAberta && (
              <div className="confirmacao-backdrop">
                <div className="confirmacao-content">
                  <p>Tem certeza?</p>
                  <div className="confirmacao-botoes">
                    <button className="confirmacao-sim" onClick={handleConfirmarAcao}>Sim</button>
                    <button className="confirmacao-nao" onClick={handleCancelarAcao}>Não</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Agendamentos;
