import React, { useState, useEffect, useMemo } from 'react'; // Adicionado useEffect
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { ptBR } from 'date-fns/locale/pt-BR';
import './Agendamentos.css';
import { getAgendamentos, type AgendamentoComCliente } from '../services/agendamentoService';

// --- Configuração do Localizer ---
const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// Interface para o formato que o Calendário precisa
interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: AgendamentoComCliente; // Guarda o dado original da API
}

// --- Componente Principal ---
const Agendamentos: React.FC = () => {
  // 2. Estado para guardar os agendamentos que vêm da API
  const [agendamentos, setAgendamentos] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [view, setView] = useState<View>('month');
  const navigate = useNavigate();

  // 3. useEffect para buscar os dados da API quando o componente carregar
  useEffect(() => {
    const carregarAgendamentos = async () => {
      try {
        setIsLoading(true);
        const dataDaApi = await getAgendamentos();

        // 4. Transformação dos dados da API para o formato do Calendário
        const eventosFormatados: CalendarEvent[] = dataDaApi.map(ag => {
          const [ano, mes, dia] = ag.data.substring(0, 10).split('-').map(Number);
          const [hora, minuto] = ag.horario.substring(0, 5).split(':').map(Number);

          const inicio = new Date(ano, mes - 1, dia, hora, minuto);
          const fim = new Date(inicio);
          fim.setHours(inicio.getHours() + 1); // Assumindo duração de 1 hora

          return {
            id: ag.id_agendamento,
            title: ag.nome, // O título do evento no calendário será o nome do cliente
            start: inicio,
            end: fim,
            resource: ag, // Guardamos o objeto original para referência
          };
        });

        setAgendamentos(eventosFormatados);
      } catch (err) {
        setError("Falha ao carregar os agendamentos.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    carregarAgendamentos();
  }, []); // Array vazio [] = roda apenas uma vez, quando o componente monta

  // 5. O useMemo agora filtra os dados do estado 'agendamentos'
  const agendamentosDoDia = useMemo(() => {
    return agendamentos.filter((ag) => 
      format(ag.start, 'yyyy-MM-dd') === format(dataSelecionada, 'yyyy-MM-dd')
    );
  }, [agendamentos, dataSelecionada]);

  const formatarHora = (data: Date): string => format(data, 'HH:mm');
  const handleSelecionarSlot = (slotInfo: { start: Date; }) => setDataSelecionada(slotInfo.start);
  const handleNavegacao = (novaData: Date) => setDataSelecionada(novaData);
  const handleView = (novaView: View) => setView(novaView);
  
  const handleCriarAgendamento = () => {
    navigate("/agendamento/criar");
  };

  return (
    <div className="container-geral">
      <div className="painel-agendamentos">
        <header className="cabecalho">
          <h1>Agendamentos</h1>
          <button className="botao-novo-agendamento" onClick={handleCriarAgendamento}>+ Novo agendamento</button>
        </header>

        <h1>Buscar por cliente</h1>
        <input type="text" placeholder="Buscar por cliente" className="campo-busca" />

        <main className="conteudo-principal">
          <div className="painel-esquerdo">
            <div className="lista-agendamentos-container">
              <h2>{view === 'month' ? `Agendamentos ${format(dataSelecionada, 'dd/MM/yyyy')}` : 'Agendamentos do Dia'}</h2>
              {isLoading && <p>Carregando agendamentos...</p>}
              {error && <p className="error-message">{error}</p>}
              {!isLoading && !error && (
                <ul className="lista-agendamentos">
                  {agendamentosDoDia.length > 0 ? (
                    agendamentosDoDia.map((ag) => (
                      <li key={ag.id} className="item-agendamento">
                        <div className="info-agendamento">
                          <span>{`${formatarHora(ag.start)} - ${formatarHora(ag.end)}`}</span>
                          <span>{ag.title}</span> {/* O nome do cliente agora é 'title' */}
                        </div>
                        <span className="marcador-vermelho"></span>
                      </li>
                    ))
                  ) : (
                    <p className="sem-agendamentos">Nenhum agendamento para este dia.</p>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="painel-direito">
            <Calendar
              localizer={localizer}
              events={agendamentos} // 6. O calendário usa os dados do estado
              startAccessor="start" // O calendário espera 'start' e 'end'
              endAccessor="end"
              titleAccessor="title"
              style={{ height: '100%', width: '100%' }}
              culture='pt-BR'
              messages={{ next: "Próximo", previous: "Anterior", today: "Hoje", month: "Mês", week: "Semana", day: "Dia", agenda: "Agenda", date: "Data", time: "Hora", event: "Evento" }}
              onSelectSlot={handleSelecionarSlot}
              selectable
              date={dataSelecionada}
              onNavigate={handleNavegacao}
              view={view}
              onView={handleView}
            />
          </div>
        </main>
      </div>
      <footer className="rodape"></footer>
    </div>
  );
};

export default Agendamentos;