
# Critérios de Priorização

## **MoSCoW**

O **MoSCoW** é usado para coletar a percepção de importância do cliente, informando o **valor do negócio** sobre cada item (requisito, funcionalidade, etc.). Essa prioridade qualitativa é convertida em números para compor os elementos da fórmula do **WSJF**, enquanto os outros fatores da fórmula são estimados pela equipe.

**MoSCoW** é um acrônimo que representa quatro níveis de prioridade:

| Letra | Significado            | Descrição                                                                 | Peso |
|-------|------------------------|---------------------------------------------------------------------------|------|
| M     | Must have              | Requisitos obrigatórios para o sistema funcionar. Sem eles, o projeto falha. | 4    |
| S     | Should have            | Requisitos importantes, mas não vitais. Podem ser adiados, se necessário.  | 3    |
| C     | Could have             | Requisitos desejáveis, que agregam valor, mas são opcionais.              | 2    |
| W     | Won’t have (this time) | Requisitos que não serão incluídos na entrega atual, mas podem ser considerados futuramente. | 1    |

---

## **WSJF (Weighted Shortest Job First)**

**WSJF** é uma técnica utilizada para priorizar funcionalidades com base na relação entre o **valor entregue** e o **esforço necessário** para implementá-las.

### **Fatores avaliados**

- **Valor do Negócio**: Peso derivado da priorização MoSCoW (de 1 a 4)
- **Urgência**: Avaliação de quão urgente é a entrega da funcionalidade (1 a 5)
- **Redução de Risco**: Quanto a funcionalidade ajuda a reduzir riscos (1 a 5)  
  (5 = pouco arriscado / 1 = muito arriscado)
- **Tamanho do Trabalho**: Estimativa em dias para a conclusão da tarefa

### **Fórmula**

WSJF = (Valor do Negócio + Urgência + Redução de Risco) / Tamanho do Trabalho

> Quanto maior o WSJF, maior a prioridade do requisito.

---

# **BACKLOG** 

| ID     | Título                           | Descrição                                                                 | Regras de Negócio                          | Objetivo específico                                     | MoSCoW | WSJF | MVP |
|--------|----------------------------------|---------------------------------------------------------------------------|--------------------------------------------|----------------------------------------------------------|--------|------|-----|
| **RF01**   | Realizar agendamento             | Permitir selecionar data e horário disponíveis para marcar compromisso    | 02, 03, 04, 06, 31, 47            | 2-Otimizar gestão de orçamentos e agendamentos           | M      | 8    | X   |
| **RF02**   | Visualizar serviços agendados    | Listar agendamentos para os administradores                               | 01, 07, 08, 09, 10, 11, 12, 13         | 2-Otimizar gestão de orçamentos e agendamentos           | M      | 8    | X   |
| **RF03**   | Remarcar agendamento             | Permitir remarcação de compromissos                                       | 14, 16, 19, 20, 21, 22          | 2-Otimizar gestão de orçamentos e agendamentos           | M      | 8    | X   |
| **RF04**   | Cancelar agendamento             | Permitir o cancelamento de agendamentos                                   | 23, 26, 27, 28, 30                 | 2-Otimizar gestão de orçamentos e agendamentos           | M      | 12   | X   |
| **RF05**   | Criar orçamento                  | Permitir criação de orçamentos no site                                    | 32, 34, 35, 36, 73              | 2-Otimizar gestão de orçamentos e agendamentos           | M      | 9    | X   |
| **RF06**   | Listar orçamentos                | Listar orçamentos para acompanhamento                                     | 37, 38, 40, 41, 42                          | 2-Otimizar gestão de orçamentos e agendamentos           | M      | 12   | X   |
| **RF07**   | Editar orçamentos                | Permitir edição dos orçamentos                                            | 43, 44                         | 2-Otimizar gestão de orçamentos e agendamentos           | M      | 8    | X   |
| **RF08**   | Criar Venda                      | Permitir o registro de uma venda                                          | 56, 73                              | 4-Aprimorar gestão financeira e de vendas                | M      | 6    | X   |
| **RF09**   | Listar vendas                    | Apresentar lista de vendas feitas                                         | 49, 50, 51, 52                          | 4-Aprimorar gestão financeira e de vendas                | M      | 7    | X   |
| **RF10**   | Visualizar venda                 | Visualização de detalhes da venda                                         | 53, 54                                     | 4-Aprimorar gestão financeira e de vendas                | M      | 7    | X   |
| **RF11**   | Editar venda                     | Editar detalhes da venda                                                  | 49, 60                              | 4-Aprimorar gestão financeira e de vendas                | M      | 5    | X   |
| **RF12**   | Registrar recibo                 | Registrar recibos com dados do serviço prestado                          | 62, 63, 64, 65                              | 4-Aprimorar gestão financeira e de vendas                | M      | 7    | X   |
| **RF13**   | Editar recibo                    | Alterar dados registrados em um recibo                                   | 57, 65, 66, 72                              | 4-Aprimorar gestão financeira e de vendas                | M      | 7    | X   |
| **RF14**   | Exportar recibo                  | Gerar PDF com os dados do recibo                                         | 58, 67, 68, 69, 70, 71, 72                  | 4-Aprimorar gestão financeira e de vendas                | M      | 7    | X   |
| **RF15**   | Registrar despesas               | Registrar novas despesas para controle financeiro                        | 57, 74, 75, 76, 77, 78                      | 4-Aprimorar gestão financeira e de vendas                | W      | 3    |     |
| **RF16**   | Editar despesas                  | Permitir edição de despesas conforme permissões                          | 79, 80                                     | 4-Aprimorar gestão financeira e de vendas                | W      | 3    |     |
| **RF17**   | Exportar despesas                | Gerar relatório em PDF/XLS com os dados registrados                      | 83, 84, 85, 86                              | 4-Aprimorar gestão financeira e de vendas                | W      | 3    |     |
| **RF18**   | Registrar interações com cliente | Registrar histórico de serviços e pagamentos                             | 87, 88, 89                                  | 4-Aprimorar gestão financeira e de vendas                | W      | 1    |     |
| **RF19*8   | Contatar empresa                 | Comunicação por WhatsApp, formulário e redes sociais                     | 90, 91, 92                                  | 1-Sofisticar o marketing e posicionamento online         | M      | 14   | X   |
| **RF20**   | Cadastrar FAQ                    | Adicionar perguntas frequentes à FAQ                                     | 29, 39, 93                                  | 1-Sofisticar o marketing e posicionamento online         | S      | 2    |     |
| **RF21**   | Excluir Avaliação                | Excluir avaliações feitas por clientes                                   | 30, 59                                    | 1-Sofisticar o marketing e posicionamento online         | W      | 2    |     |
| **RF22**   | Publicar avaliação               | Publicar nota e comentário sobre o serviço                               | 24, 25                                | 1-Sofisticar o marketing e posicionamento online         | W      | 2    |     |
| **RF23**   | Criar perfil do cliente          | Criar perfil com dados e histórico do cliente                            | 46, 61, 73                                 | 4-Aprimorar gestão financeira e de vendas                | M      | 3    | X   |
| **RF24**   | Editar informações do cliente    | Atualizar dados de contato e identificação                               | 73, 98                                     | 4-Aprimorar gestão financeira e de vendas                | M      | 3    | X   |
| **RF25**   | Excluir perfil do cliente        | Excluir dados do cliente                                                 | 17, 73                                    | 4-Aprimorar gestão financeira e de vendas                | M      | 3    | X   |
| **RF26**   | Gerar gráfico de desempenho      | Gráfico com métricas de atendimento e conversão                          | 81, 108                                    | 3-Viabilizar gestão de demandas                          | C      | 1    |     |
| **RF27**   | Gráfico comparativo financeiro   | Receita vs Despesas por mês                                              | 18, 108                                | 4-Aprimorar gestão financeira e de vendas                | C      | 1    | X   |
| **RNF01**  | Consultar histórico de despesas  | Tempo de resposta inferior a 2 segundos                                  |                                              | —                                                        | M      |      | X   |
| **RNF02**  | Garantir LGPD                    | Conformidade com a LGPD (Lei nº 13.709/2018)                             |                                              | —                                                        | M      |      | X   |
| **RNF03**  | Adaptar a diferentes telas       | Suporte a 720x1280, 1080x1920 e 1920x1080                                |                                              | —                                                        | S      |      | X   |
| **RNF04**  | Exibir categorias                | Mostrar portfólio e menus principais                                     |                                              | —                                                        | M      |      | X   |
| **RNF05**  | Exibir FAQ                       | Exibir área de dúvidas frequentes                                        |                                              | —                                                        | M      |      | X   |
| **RNF06**  | Exibir portfólio                 | Exibir produtos e serviços cadastrados                                   |                                              | —                                                        | M      |      | X   |

