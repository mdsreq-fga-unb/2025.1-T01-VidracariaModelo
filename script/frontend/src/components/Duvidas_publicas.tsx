import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importando o useNavigate
import styles from './Duvidas_publicas.module.css';

// Usando a sua interface, que corresponde aos dados da API
interface Duvida {
  id: number;
  duvida: string;
  resposta: string;
}

const FaqAccordion: React.FC = () => {
  // 2. Estado para armazenar as dúvidas vindas da API
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Estados para uma melhor experiência do usuário durante a chamada da API
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const navigate = useNavigate(); // Inicializando o hook de navegação

  const API_URL = import.meta.env.VITE_URL_BASE;

  // 3. O useEffect agora tem a única responsabilidade de buscar os dados.
  useEffect(() => {
    const buscarDuvidas = async () => {
      try {
        setCarregando(true); // Inicia o carregamento
        setErro(null);       // Limpa erros anteriores

        const res = await fetch(`${API_URL}/duvidas`);

        if (res.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          navigate("/login");
          return;
        }

        if (!res.ok) {
          throw new Error('Falha ao buscar os dados das dúvidas.');
        }

        const data = await res.json();
        setDuvidas(data); // Armazena os dados da API no estado

      } catch (err: any) {
        console.error("Erro ao buscar duvidas:", err);
        setErro(err.message || 'Erro ao carregar dúvidas');
      } finally {
        setCarregando(false); // Finaliza o carregamento, com sucesso ou erro
      }
    };

    buscarDuvidas();
  }, [navigate]); // O array de dependências está correto.


  const handleItemClick = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  // Renderização condicional baseada no estado da chamada da API
  if (carregando) {
    return <div className={styles.statusMessage}>Carregando dúvidas...</div>;
  }

  if (erro) {
    return <div className={styles.statusMessage}>{erro}</div>;
  }

  return (
    <>
      <div className={styles.faqContainer}>
        <div className={styles.faqContent}>
          <h1 className={styles.title}>FAQ</h1>
          <h2 className={styles.subtitle}>Como podemos te ajudar ?</h2>

          <div className={styles.accordion}>
            {/* 4. Mapeando os dados do estado 'duvidas' que veio da API */}
            {duvidas.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.id} // Usando o 'id' da API como key, que é mais confiável
                  className={`${styles.item} ${isOpen ? styles.open : ''}`}
                  onClick={() => handleItemClick(index)}
                >
                  <div className={styles.header}>
                    {/* Usando 'item.duvida' e 'item.resposta' da API */}
                    <span className={styles.questionText}>{item.duvida}</span>
                    <span className={styles.icon}></span>
                  </div>
                  <div className={styles.answer}>
                    <p>{item.resposta}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <footer className="footerContainer1">
        <div className="redStripe1" />
      </footer>
    </>
  );
};

export default FaqAccordion;