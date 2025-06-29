import React from 'react';
// Importamos o tipo 'Event' para nos ajudar com a tipagem das props
import { Calendar, dateFnsLocalizer, Views, type Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// 1. DEFINIMOS O FORMATO DAS PROPS QUE O COMPONENTE VAI ACEITAR
interface AgendaProps {
  eventos: Event[]; // Dizemos que vamos receber uma prop chamada 'eventos'
}

// A LISTA FIXA DE EVENTOS FOI REMOVIDA DAQUI!

// 2. ATUALIZAMOS A DECLARAÇÃO PARA ACEITAR AS PROPS
const AgendaComponente: React.FC<AgendaProps> = ({ eventos }) => {
  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        // 3. USAMOS A PROP 'eventos' QUE VEIO DE FORA
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        culture="pt-BR"
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
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
          event: "Evento",
          noEventsInRange: "Não há eventos neste período.",
          showMore: total => `+ Ver mais (${total})`
        }}
      />
    </div>
  );
};

export default AgendaComponente;