const servicos = [
  {
    titulo: "Fechamento de pia",
    img: "/assets/teste.jpg",
    desc: "Transforme sua cozinha com nosso fechamento de vidro, unindo design moderno e funcionalidade.",
  },
  {
    titulo: "Portas de vidro temperado",
    img: "/assets/teste.jpg",
    desc: "Oferece segurança e sofisticação para seus ambientes. Durabilidade e fácil manutenção.",
  },
  {
    titulo: "Janelas de vidro temperado",
    img: "/assets/teste.jpg",
    desc: "Luminosidade com design moderno. Segurança, praticidade e valorização do imóvel.",
  },
  {
    titulo: "Fechamento de varandas",
    img: "/assets/teste.jpg",
    desc: "Conforto com proteção térmica e acústica. Valorize seu espaço.",
  },
  {
    titulo: "Espelhos em geral",
    img: "/assets/teste.jpg",
    desc: "Beleza e funcionalidade com soluções sob medida. Ideal para ampliação visual e estilo.",
  },
  {
    titulo: "Vidros comuns",
    img: "/assets/teste.jpg",
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
      <button className="botao-orcamento-destaque">
        Solicite um orçamento agora !
      </button>

      {/* <div className="rodape-icons">
        <img src="/assets/wpp.jpg" alt="WhatsApp" className="icon" />
        <img src="/assets/inst.jpg" alt="Instagram" className="icon" />
      </div> */}
    </section>
  );
}
