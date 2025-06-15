const servicos = [
    {
      titulo: "Fechamento de pia",
      img: "/servicos/pia.jpg",
      desc: "Design moderno com segurança e durabilidade."
    },
    {
      titulo: "Portas de vidro temperado",
      img: "/servicos/porta.jpg",
      desc: "Elegância e privacidade com resistência."
    },
    {
      titulo: "Janelas de vidro temperado",
      img: "/servicos/janela.jpg",
      desc: "Maior luminosidade e resistência para seu imóvel."
    },
    {
      titulo: "Fechamento de varandas",
      img: "/servicos/varanda.jpg",
      desc: "Conforto com proteção contra intempéries."
    },
    {
      titulo: "Espelhos em geral",
      img: "/servicos/espelho.jpg",
      desc: "Embelezam ambientes com sofisticação."
    },
    {
      titulo: "Vidros comuns",
      img: "/servicos/vidro.jpg",
      desc: "Opções variadas com ótima luminosidade."
    }
  ];
 
  export default function SessaoServico() {
    return (
      <section className="servicos-sessao">
        <h2>Serviços Vidraçaria Modelo</h2>
        <div className="servicos-grid">
          {servicos.map((servico, index) => (
            <div className="servico-card" key={index}>
              <img src={servico.img} alt={servico.titulo} />
              <h3>{servico.titulo}</h3>
              <p>{servico.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }