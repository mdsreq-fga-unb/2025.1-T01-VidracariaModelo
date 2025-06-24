import FechamentoPia from '../assets/servicos/Fechamento_de_pia.jpg';
import PortaVidro from '../assets/servicos/Porta_Vidro_Temperado.png';
import JanelaVidro from '../assets/servicos/Janela_Vidro_Temperado.jpg';
import FechamentoVarandas from '../assets/servicos/Fechamento_Varandas.png';
import EspelhosGeral from '../assets/servicos/Espelhos_Geral.png';
import VidrosGeral from '../assets/servicos/Vidros_Geral.png';

const servicos = [
  {
    titulo: "Fechamento de pia",
    img: FechamentoPia,
    desc: "Transforme sua cozinha com nosso fechamento de vidro, unindo design moderno e funcionalidade.",
  },
  {
    titulo: "Portas de vidro temperado",
    img: PortaVidro,
    desc: "Oferece segurança e sofisticação para seus ambientes. Durabilidade e fácil manutenção.",
  },
  {
    titulo: "Janelas de vidro temperado",
    img: JanelaVidro,
    desc: "Luminosidade com design moderno. Segurança, praticidade e valorização do imóvel.",
  },
  {
    titulo: "Fechamento de varandas",
    img: FechamentoVarandas,
    desc: "Conforto com proteção térmica e acústica. Valorize seu espaço.",
  },
  {
    titulo: "Espelhos em geral",
    img: EspelhosGeral,
    desc: "Beleza e funcionalidade com soluções sob medida. Ideal para ampliação visual e estilo.",
  },
  {
    titulo: "Vidros comuns",
    img: VidrosGeral,
    desc: "Com diversas opções de texturas, proporcionam luminosidade e privacidade.",
  },
];


export default function SessaoServico() {
  return (
    <section className="sessao-servicos">
      <h2>Serviços Vidraçaria Modelo</h2>
      <div className="grid-servicos">
        {servicos.map((servico, index) => (
          <article className="card-servico" key={index}>
            <img src={servico.img} alt={servico.titulo} />
            <h3>{servico.titulo}</h3>
            <p>{servico.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
