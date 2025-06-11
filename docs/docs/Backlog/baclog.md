
# Critérios de Priorização

## MoSCoW

O **MoSCoW** é usado para coletar a percepção de importância do cliente, informando o **valor do negócio** sobre cada item (requisito, funcionalidade, etc.). Essa prioridade qualitativa é convertida em números para compor os elementos da fórmula do **WSJF**, enquanto os outros fatores da fórmula são estimados pela equipe.

**MoSCoW** é um acrônimo que representa quatro níveis de prioridade:

| Letra | Significado            | Descrição                                                                 | Peso |
|-------|------------------------|---------------------------------------------------------------------------|------|
| M     | Must have              | Requisitos obrigatórios para o sistema funcionar. Sem eles, o projeto falha. | 4    |
| S     | Should have            | Requisitos importantes, mas não vitais. Podem ser adiados, se necessário.  | 3    |
| C     | Could have             | Requisitos desejáveis, que agregam valor, mas são opcionais.              | 2    |
| W     | Won’t have (this time) | Requisitos que não serão incluídos na entrega atual, mas podem ser considerados futuramente. | 1    |

---

## WSJF (Weighted Shortest Job First)

**WSJF** é uma técnica utilizada para priorizar funcionalidades com base na relação entre o **valor entregue** e o **esforço necessário** para implementá-las.

### Fatores avaliados:

- **Valor do Negócio**: Peso derivado da priorização MoSCoW (de 1 a 4)
- **Urgência**: Avaliação de quão urgente é a entrega da funcionalidade (1 a 5)
- **Redução de Risco**: Quanto a funcionalidade ajuda a reduzir riscos (1 a 5)  
  (5 = pouco arriscado / 1 = muito arriscado)
- **Tamanho do Trabalho**: Estimativa em dias para a conclusão da tarefa

### Fórmula:

WSJF = (Valor do Negócio + Urgência + Redução de Risco) / Tamanho do Trabalho

> Quanto maior o WSJF, maior a prioridade do requisito.

---

# BACKLOG 

| ID     | Título                                | Descrição                                                                                                      | Regra de Negócio                           | Objetivo específico                                | MosCow | WSJF | MVP |
|:--------|:--------------------------------------|:---------------------------------------------------------------------------------------------------------------|:---------------------------------------------|:-----------------------------------------------------|:--------|:------|:------|
| RF01  | Realizar agendamento                   | O sistema deve permitir a seleção de data e horário disponíveis para marcar um compromisso.                    | RN 02, 03, 18, 27, 81, 83                  | 2-Otimizar gestão de orçamentos e agendamentos       | M      | 10   | X    |
| RF02  | Visualizar serviços agendados          | O sistema deve listar os agendamentos realizados para os administradores visualizarem os compromissos do dia.  | RN 01, 04, 05, 06, 07, 08, 17               | 2-Otimizar gestão de orçamentos e agendamentos       | M      | 10   | X    |
| RF03  | Remarcar agendamento                   | O sistema deve permitir a remarcação de agendamentos para programar compromissos com clientes.                  | RN 09, 10, 11, 12, 13, 14                   | 2-Otimizar gestão de orçamentos e agendamentos       | M      | 5    | X    |
| RF04  | Cancelar agendamento                   | O sistema deve permitir o cancelamento dos agendamentos para ajustes na agenda de compromissos.                 | RN 15, 16, 82                               | 2-Otimizar gestão de orçamentos e agendamentos       | M      | 14   | X    |
| RF05  | Criar orçamento                         | O sistema deve permitir a criação de orçamentos para registrar propostas de serviços no site.                   | RN 19, 20, 21, 22, 23, 24, 56               | 2-Otimizar gestão de orçamentos e agendamentos       | M      | 5    | X    |
| RF06  | Listar orçamentos                       | O sistema deve listar orçamentos solicitados para facilitar o acompanhamento das propostas.                     | RN 25, 26, 28, 29                           | 2-Otimizar gestão de orçamentos e agendamentos       | M      | 14   | X    |
| RF07  | Editar orçamentos                       | O sistema deve permitir edição de valores, prazos e observações para atualizar os dados do orçamento.           | RN 30, 31, 32, 33                           | 2-Otimizar gestão de orçamentos e agendamentos       | M      | 6    | X    |
| RF08  | Criar venda                             | O sistema deve permitir o registro de uma venda.                                                                | RN 34, 41, 42, 56                           | 4-Aprimorar gestão financeira e de vendas            | M      | 12   | X    |
| RF09  | Listar vendas                           | O sistema deve apresentar a lista de vendas feitas pela empresa para controle comercial.                        | RN 34, 35, 36, 37, 38                       | 4-Aprimorar gestão financeira e de vendas            | M      | 14   | X    |
| RF10  | Visualizar venda                        | O sistema deve permitir a visualização dos detalhes da venda para consulta de informações.                      | RN 39, 40                                   | 4-Aprimorar gestão financeira e de vendas            | M      | 14   | X    |
| RF11  | Editar venda                             | O sistema deve permitir edição dos detalhes da venda para correção de dados.                                    | RN 35, 45, 46                               | 4-Aprimorar gestão financeira e de vendas            | M      | 14   | X    |
| RF12  | Registrar recibo                         | O sistema deve permitir o registro de recibos com dados do serviço prestado para gerar comprovantes.             | RN 47, 48, 49                               | 4-Aprimorar gestão financeira e de vendas            | M      | 7    | X    |
| RF13  | Editar recibo                             | O sistema deve permitir alteração dos dados registrados em um recibo para correções.                            | RN 43, 49, 50, 55                           | 4-Aprimorar gestão financeira e de vendas            | M      | 7    | X    |
| RF14  | Exportar recibo                           | O sistema deve gerar arquivo PDF com os dados do recibo preenchido para emissão de comprovantes.                 | RN 44, 51, 52, 53, 54, 55                   | 4-Aprimorar gestão financeira e de vendas            | M      | 7    | X    |
| RF15  | Registrar despesas                        | O sistema deve permitir que usuários registrem novas despesas para controle financeiro.                         | RN 43, 57, 58, 59, 60                       | 4-Aprimorar gestão financeira e de vendas            | W      | 3    |      |
| RF16  | Editar despesas                            | O sistema deve permitir edição de despesas conforme permissões para atualização de registros.                   | RN 61, 62                                   | 4-Aprimorar gestão financeira e de vendas            | W      | 3    |      |
| RF17  | Exportar despesas                          | O sistema deve gerar relatório em PDF e XLS com os dados registrados das despesas para controle e análise.       | RN 65, 66                                   | 4-Aprimorar gestão financeira e de vendas            | W      | 3    |      |
| RF18  | Registrar interações com cliente           | O sistema deve registrar um log de serviços requisitados pelo cliente com informações de pagamento e histórico. | RN 67, 68                                   | 4-Aprimorar gestão financeira e de vendas            | W      | 1    |      |
| RF19  | Contatar empresa                           | O sistema deve permitir comunicação via WhatsApp, formulário e redes sociais para facilitar o contato.           | RN 69, 70, 71                               | 1-Sofisticar o marketing e posicionamento online     | M      | 14   | X    |
| RF20  | Cadastrar perguntas frequentes na FAQ      | O sistema deve permitir cadastro de perguntas frequentes pelos administradores.                                  | RN 72, 73, 74                               | 1-Sofisticar o marketing e posicionamento online     | S      | 3    |      |
| RF21  | Excluir avaliação                           | O sistema deve permitir a exclusão de avaliações de clientes.                                                   | RN 75, 76                                   | 1-Sofisticar o marketing e posicionamento online     | W      | 3    |      |
| RF22  | Publicar avaliação                          | O sistema deve permitir publicação de avaliações com nota e comentário.                                         | RN 78, 84, 85                               | 1-Sofisticar o marketing e posicionamento online     | W      | 2    |      |
| RF23  | Criar perfil do cliente                     | O sistema deve permitir a criação de perfis de clientes para armazenar dados e histórico de interações.         | RN 56, 77, 80                               | 4-Aprimorar gestão financeira e de vendas            | M      | 2    | X    |
| RF24  | Editar informações do cliente               | O sistema deve permitir a edição das informações básicas de identificação e contato dos clientes.               | RN 56, 77                                   | 4-Aprimorar gestão financeira e de vendas            | M      | 3    | X    |
| RF25  | Excluir perfil do cliente                   | O sistema deve permitir a exclusão dos perfis de clientes.                                                      | RN 56, 86                                   | 4-Aprimorar gestão financeira e de vendas            | M      | 3    | X    |
| RF26  | Gerar gráfico de desempenho                 | O sistema deve gerar gráficos de métricas como orçamento, conversões e atendimentos.                            | RN 63                                       | 3-Viabilizar gestão de demandas                      | C      | 1    |      |
| RF27  | Gerar gráfico comparativo financeiro        | O sistema deve gerar um gráfico de receitas vs despesas mensais.                                                | RN 44, 64                                   | 4-Aprimorar gestão financeira e de vendas            | C      | 1    | X    |
| RNF01 | Consultar histórico de despesas             | As consultas devem ter tempo de resposta inferior a 2 segundos.                                                 |                                             | 3-Viabilizar gestão de demandas                      | M      | 3    | X    |
| RNF02 | Garantir LGPD                                | Garantir conformidade com a Lei Geral de Proteção de Dados.                                                     |                                             | 3-Viabilizar gestão de demandas                      | M      | 10   | X    |
| RNF03 | Adaptar a diferentes telas                   | A interface deve se adaptar aos tamanhos 720x1280, 1080x1920 e 1920x1080.                                       |                                             | 3-Viabilizar gestão de demandas                      | M      | 14   | X    |
| RNF04 | Exibir categorias                             | A página principal deve apresentar as categorias principais para navegação.                                     |                                             | 3-Viabilizar gestão de demandas                      | M      | 10   | X    |
| RNF05 | Exibir FAQ                                    | Exibir área de dúvidas frequentes sobre serviços e processos.                                                   |                                             | 3-Viabilizar gestão de demandas                      | M      | 7    | X    |
| RNF06 | Exibir produtos e serviços                    | Exibir os produtos e serviços cadastrados no portfólio online.                                                  |                                             | 3-Viabilizar gestão de demandas                      | M      | 12   | X    |
