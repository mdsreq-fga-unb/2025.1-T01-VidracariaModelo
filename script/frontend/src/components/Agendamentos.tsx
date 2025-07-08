import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { ptBR } from 'date-fns/locale/pt-BR';
import './Agendamentos.css'; // Lembre-se de criar este arquivo de CSS

// --- Interface ---
// Esta é a estrutura dos nossos dados mockados
interface Agendamento {
  id: number;
  cliente: string;
  inicio: Date;
  fim: Date;
  observacoes?: string; // Adicionei observações como opcional para o exemplo
}

// --- Dados Mockados Iniciais ---
const agendamentosMockIniciais: Agendamento[] = [
  { id: 1, cliente: 'Cliente Silva', inicio: new Date(new Date().setHours(9, 0, 0, 0)), fim: new Date(new Date().setHours(10, 0, 0, 0)), observacoes: 'Primeira consulta.' },
  { id: 2, cliente: 'Mariana Costa', inicio: new Date(new Date().setHours(10, 0, 0, 0)), fim: new Date(new Date().setHours(11, 0, 0, 0)) },
  { id: 4, cliente: 'Ana Pereira', inicio: new Date(2025, 5, 20), fim: new Date(new Date(2025, 5, 20).setHours(11, 0, 0, 0)), observacoes: 'Retorno.' },
];

// --- Configuração do Localizer ---
const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// --- Componente Principal ---
const Agendamentos: React.FC = () => {
  // Dados mockados agora dentro de um estado para permitir a exclusão
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(agendamentosMockIniciais);
  
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [view, setView] = useState<View>('month');
  
  // Estados para controlar o modal principal
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Agendamento | null>(null);

  // Estados para controlar o modal de confirmação
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [acaoPendente, setAcaoPendente] = useState<'editar' | 'excluir' | null>(null);

  const navigate = useNavigate();

  // Filtra os agendamentos do dia para a lista da esquerda
  const agendamentosDoDia = useMemo(() => {
    return agendamentos.filter((agendamento) => 
      format(agendamento.inicio, 'yyyy-MM-dd') === format(dataSelecionada, 'yyyy-MM-dd')
    );
  }, [agendamentos, dataSelecionada]);


  const formatarHora = (data: Date): string => format(data, 'HH:mm');
  const handleSelecionarSlot = (slotInfo: { start: Date; }) => setDataSelecionada(slotInfo.start);
  const handleNavegacao = (novaData: Date) => setDataSelecionada(novaData);
  const handleView = (novaView: View) => setView(novaView);

  const eventPropGetter = (event: Agendamento) => ({
    className: 'evento-calendario',
    title: `${formatarHora(event.inicio)} - ${event.cliente}`
  });

  const handleCriarAgendamento = () => {
    navigate("/agendamento/criar");
  };

  // LÓGICA DO MODAL
  const handleSelectEvent = (evento: Agendamento) => {
    setEventoSelecionado(evento);
    setModalAberto(true);
  };
  
  const fecharTudo = () => {
    setModalAberto(false);
    setConfirmacaoAberta(false);
    setEventoSelecionado(null);
    setAcaoPendente(null);
  };

  const handleEditar = () => {
    setAcaoPendente('editar');
    setConfirmacaoAberta(true);
  };

  const handleExcluir = () => {
    setAcaoPendente('excluir');
    setConfirmacaoAberta(true);
  };

  const handleCancelarAcao = () => {
    setConfirmacaoAberta(false);
    setAcaoPendente(null);
  };

  const handleConfirmarAcao = () => {
    if (!eventoSelecionado || !acaoPendente) return;

    if (acaoPendente === 'editar') {
      navigate(`/agendamento/editar/${eventoSelecionado.id}`);
    } else if (acaoPendente === 'excluir') {
      setAgendamentos(agendamentos.filter(ag => ag.id !== eventoSelecionado.id));
      alert("Agendamento excluído!");
    }

    fecharTudo();
  };

  return (
    <div className="container-geral">
      <div className="painel-agendamentos">
        <header className="cabecalho">
          <h1>Agendamentos</h1>
          <button className="botao-novo-agendamento" onClick={handleCriarAgendamento}>+ Novo agendamento</button>
        </header>

        <input type="text" placeholder="Buscar por cliente" className="campo-busca" />

        <main className="conteudo-principal">
          <div className="painel-esquerdo">
            <div className="lista-agendamentos-container">
              <h2>Agendamentos {format(dataSelecionada, 'dd/MM/yyyy')}</h2>
              <ul className="lista-agendamentos">
                {agendamentosDoDia.length > 0 ? (
                  agendamentosDoDia.map((ag) => (
                    <li key={ag.id} className="item-agendamento">
                      <div className="info-agendamento">
                        <span>{`${formatarHora(ag.inicio)} - ${formatarHora(ag.fim)}`}</span>
                        <span>{ag.cliente}</span>
                      </div>
                      <span className="marcador-vermelho"></span>
                    </li>
                  ))
                ) : (
                  <p className="sem-agendamentos">Nenhum agendamento para este dia.</p>
                )}
              </ul>
            </div>
          </div>

          <div className="painel-direito">
            <Calendar
              localizer={localizer}
              events={agendamentos}
              startAccessor="inicio"
              endAccessor="fim"
              titleAccessor="cliente"
              style={{ height: '100%', width: '100%' }}
              culture='pt-BR'
              messages={{ next: "Próximo", previous: "Anterior", today: "Hoje", month: "Mês", week: "Semana", day: "Dia", agenda: "Agenda", date: "Data", time: "Hora", event: "Evento" }}
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
      <footer className="rodape"></footer>

      {/* Renderização Condicional do Modal Principal */}
      {modalAberto && eventoSelecionado && (
        <div className="modal-backdrop" onClick={fecharTudo}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Agendamento</h2>
            <div className="modal-body">
              <p><strong>Cliente:</strong> {eventoSelecionado.cliente}</p>
              <p><strong>Data:</strong> {format(eventoSelecionado.inicio, 'dd/MM/yyyy')}</p>
              <p><strong>Horário:</strong> {format(eventoSelecionado.inicio, 'HH:mm')}</p>
              {eventoSelecionado.observacoes && (
                <p><strong>Observações:</strong> {eventoSelecionado.observacoes}</p>
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-button-edit" onClick={handleEditar}>Editar</button>
              <button className="modal-button-delete" onClick={handleExcluir}>Excluir</button>
            </div>

            {/* Renderização Condicional do Modal de Confirmação */}
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