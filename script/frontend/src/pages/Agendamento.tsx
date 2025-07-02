import "./Agendamento.css";
import Calendario from "../components/Agendamentos";

const Agendamento = () => {
  console.log("Componente Agendamento renderizou"); // Adicione este log para depuração

  return (
    <div>
      {/* Ao passar 'eventosDaAgenda' daqui, estamos passando sempre a MESMA 
        referência do array, então o React não recria o Calendario sem necessidade.
      */}
      <Calendario/>
    </div>
  );
};

export default Agendamento;