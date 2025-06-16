export default function LocalizacaoMapa() {
  return ( 
    <div className="map-section">
      <h2>Venha conhecer nossa loja:</h2>
      <p>Quadra 10, lote 4, loja 2, Setor Oeste, Gama-DF. Em frente ao supermercado Vivendas.</p>
      <iframe 
        title="Mapa da loja"
        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d606.7945698396653!2d-48.07707592993694!3d-16.00610653685979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1ssupermercado%20vivendas%20setor%20oeste%20gama!5e0!3m2!1spt-BR!2sbr!4v1750016419333!5m2!1spt-BR!2sbr" 
        width="100%" 
        height="300" 
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}