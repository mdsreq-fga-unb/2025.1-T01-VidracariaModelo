import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import {format} from 'date-fns/format';
import {parse} from 'date-fns/parse';
import {startOfWeek} from 'date-fns/startOfWeek';
import {getDay} from 'date-fns/getDay';
import {ptBR} from 'date-fns/locale/pt-BR';
import './Agendamentos.css';

// --- Interface e Dados Mockados ---
interface Agendamento {
  id: number;
  cliente: string;
  inicio: Date;
  fim: Date;
}

const agendamentosMock: Agendamento[] = [
  { id: 1, cliente: 'Cliente Silva', inicio: new Date(new Date().setHours(9, 0, 0, 0)), fim: new Date(new Date().setHours(10, 0, 0, 0))},
  { id: 2, cliente: 'Mariana Costa', inicio: new Date(new Date().setHours(10, 0, 0, 0)), fim: new Date(new Date().setHours(11, 0, 0, 0))},
  { id: 4, cliente: 'Ana Pereira', inicio: new Date(2025, 5, 20), fim: new Date(new Date(2025, 5, 20).setHours(11, 0, 0, 0))},
];

// --- Configuração do Localizer ---
const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// --- Componente Principal ---
const Agendamentos: React.FC = () => {
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [view, setView] = useState<View>('month');
  const navigate = useNavigate();

  const agendamentosDoDia = useMemo(() => {
    if (view === 'month') {
      return agendamentosMock.filter((agendamento) => 
        format(agendamento.inicio, 'yyyy-MM-dd') === format(dataSelecionada, 'yyyy-MM-dd')
      );
    }
    return [];
  }, [dataSelecionada, view]);

  const formatarHora = (data: Date): string => format(data, 'HH:mm');
  const handleSelecionarSlot = (slotInfo: { start: Date; }) => setDataSelecionada(slotInfo.start);
  const handleNavegacao = (novaData: Date) => setDataSelecionada(novaData);
  const handleView = (novaView: View) => setView(novaView);
  const eventPropGetter = (event: Agendamento) => ({
    className: 'evento-calendario',
    title: `${formatarHora(event.inicio)} - ${event.cliente}`
  });

    const handleCriarAgendamento = async () => {
    navigate("/agendamento/criar");
  };

  return (
    <div className="container-geral">
      <div className="painel-agendamentos">
        <header className="cabecalho">
          <h1>Agendamentos</h1>
          <button className="botao-novo-agendamento" onClick={handleCriarAgendamento}>+ Novo agendamento</button>
        </header>

        {/* O CAMPO DE BUSCA FOI MOVIDO PARA CÁ */}
        <h1>Buscar por cliente</h1>
        <input 
          type="text" 
          placeholder="Buscar por cliente" 
          className="campo-busca" 
        />

        <main className="conteudo-principal">
          <div className="painel-esquerdo">
            {/* O INPUT NÃO ESTÁ MAIS AQUI */}
            <div className="lista-agendamentos-container">
              <h2>{view === 'month' ? `Agendamentos ${format(dataSelecionada, 'dd/MM/yyyy')}` : 'Agendamentos do Dia'}</h2>
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
                  <p className="sem-agendamentos">{view === 'month' ? 'Nenhum agendamento para este dia.' : 'Selecione um dia no calendário.'}</p>
                )}
              </ul>
            </div>
          </div>

          <div className="painel-direito">
            <Calendar
              localizer={localizer}
              events={agendamentosMock}
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
            />
          </div>
        </main>
      </div>
      <footer className="rodape"></footer>
    </div>
  );
};

export default Agendamentos;