import "./Agendamento.css";
// Aqui você importa o componente que definimos acima
import Calendario from "../components/Tela_Agendamentos";

// <<< A CORREÇÃO CRÍTICA ESTÁ AQUI >>>
// A lista de eventos é declarada FORA do componente Agendamento.
// Isso garante que a lista seja criada apenas UMA VEZ.
const eventosDaAgenda = [
    {
        title: 'Corte de Cabelo - Sr. João',
        start: new Date(2025, 5, 29, 15, 0, 0),
        end: new Date(2025, 5, 29, 15, 45, 0),
    },
    {
        title: 'Manicure - Sra. Clara',
        start: new Date(2025, 6, 1, 10, 0, 0),
        end: new Date(2025, 6, 1, 11, 0, 0),
    }
];

const Agendamento = () => {
  console.log("Componente Agendamento renderizou"); // Adicione este log para depuração

  return (
    <div>
      {/* Ao passar 'eventosDaAgenda' daqui, estamos passando sempre a MESMA 
        referência do array, então o React não recria o Calendario sem necessidade.
      */}
      <Calendario eventos={eventosDaAgenda} />
    </div>
  );
};

export default Agendamento;