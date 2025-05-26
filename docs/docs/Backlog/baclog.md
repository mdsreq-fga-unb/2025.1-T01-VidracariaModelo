
# Critérios de Priorização

## MoSCoW

O **MoSCoW** é usado para coletar a percepção de importância do cliente, informando o **valor do negócio** sobre cada item (requisito, funcionalidade, épico etc.). Essa prioridade qualitativa é convertida em números para compor os elementos da fórmula do **WSJF**, enquanto os outros fatores da fórmula são estimados pela equipe.

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

\[
\text{WSJF} = \frac{\text{Valor do Negócio} + \text{Urgência} + \text{Redução de Risco}}{\text{Tamanho do Trabalho}}
\]

> Quanto maior o WSJF, maior a prioridade do requisito.

---

# BACKLOG 

| ID   | TÍTULO                                                                 | DESCRIÇÃO                                                                                                                                                                                        | MosCow | Priorização WSJF | MVP |
|------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|------------------|-----|
| RF01 | Selecionar data e horário para agendamento                             | O sistema deve permitir que o cliente selecione data e horário disponíveis para realizar agendamentos.                                                                                           | M      | 7                | X   |
| RF02 | Notificar agendamento                                                  | O sistema deve fornecer notificações sempre que um novo agendamento for feito para garantir acompanhamento.                                                                                      | M      | 3                | X   |
| RF03 | Cadastrar agendamento                                                  | O sistema deve permitir que os administradores cadastrem agendamentos para registrar compromissos com clientes.                                                                                  | M      | 5                | X   |
| RF04 | Listar agendamentos do dia                                             | O sistema deve listar os agendamentos realizados para os administradores visualizarem os compromissos do dia.                                                                                    | M      | 5                | X   |
| RF05 | Remarcar agendamento                                                   | O sistema deve permitir a remarcação de agendamentos para reprogramar compromissos com clientes.                                                                                                 | M      | 5                | X   |
| RF06 | Cancelar agendamento                                                   | O sistema deve permitir o cancelamento dos agendamentos para ajustes na agenda de compromissos.                                                                                                  | M      | 14               | X   |
| RF07 | Notificar sobre alterações em agendamentos                             | O sistema deve enviar notificação caso um agendamento seja alterado ou cancelado para informar o cliente e o administrador.                                                                      | M      | 3                | X   |
| RF08 | Criar orçamento                                                        | O sistema deve permitir a criação de orçamentos para registrar propostas de serviços no site.                                                                                                    | M      | 5                | X   |
| RF09 | Listar orçamentos                                                      | O sistema deve listar orçamentos solicitados para facilitar o acompanhamento das propostas.                                                                                                      | M      | 14               | X   |
| RF10 | Editar orçamentos                                                      | O sistema deve permitir edição de valores, prazos e observações para atualizar os dados do orçamento conforme necessário.                                                                        | M      | 6                | X   |
| RF11 | Notificar expiração de orçamento                                       | O sistema deve enviar alertas ao cliente e à equipe quando um orçamento estiver próximo de expirar para garantir o acompanhamento.                                                               | C      | 3                |     |
| RF12 | Listar vendas                                                          | O sistema deve apresentar a lista de vendas feitas pela empresa para controle comercial.                                                                                                         | M      | 14               | X   |
| RF13 | Visualizar venda                                                       | O sistema deve permitir a visualização dos detalhes da venda para consulta de informações.                                                                                                       | M      | 14               | X   |
| RF14 | Editar venda                                                           | O sistema deve permitir edição dos detalhes da venda para correção de dados.                                                                                                                     | S      | 4                | X   |
| RF15 | Registrar recibo                                                       | O sistema deve permitir o registro de recibos com dados do serviço prestado para gerar comprovantes.                                                                                             | M      | 7                | X   |
| RF16 | Editar recibo                                                          | O sistema deve permitir alteração dos dados registrados em um recibo para correções.                                                                                                             | M      | 7                | X   |
| RF17 | Exportar recibo                                                        | O sistema deve gerar arquivo PDF com os dados do recibo preenchido para emissão de comprovantes.                                                                                                 | M      | 7                | X   |
| RF18 | Registrar despesas                                                     | O sistema deve permitir que usuários registrem novas despesas para controle financeiro.                                                                                                          | W      | 3                |     |
| RF19 | Categorizar despesas                                                   | O sistema deve classificar despesas por tipo para facilitar a organização financeira.                                                                                                            | W      | 3                |     |
| RF20 | Editar despesas                                                        | O sistema deve permitir edição de despesas conforme as permissões para correção ou atualização de registros.                                                                                     | W      | 3                |     |
| RF21 | Exportar despesas                                                      | O sistema deve gerar relatório em PDF com os dados registrados das despesas para controle e análise financeira.                                                                                  | W      | 3                |     |
| RF22 | Registrar interações com cliente                                       | O sistema deve registrar todas as interações feitas com o cliente para acompanhamento do histórico de atendimento.                                                                               | W      | 1                |     |
| RF23 | Contatar empresa                                                       | O sistema deve permitir comunicação por WhatsApp, formulário e redes sociais para facilitar o contato com os clientes.                                                                           | M      | 14               | X   |
| RF24 | Permitir gerenciamento da FAQ                                          | O sistema deve permitir que os administradores gerenciem as perguntas frequentes para auxiliar o cliente.                                                                                        | S      | 3                |     |
| RF25 | Excluir Avaliação                                                      | O sistema deve permitir a exclusão de avaliações para manter a integridade das informações publicadas.                                                                                           | W      | 3                |     |
| RF26 | Publicar avaliação                                                     | O sistema deve permitir que o usuário publique uma avaliação com nota e comentário para registrar sua opinião sobre os serviços.                                                                 | W      | 2                |     |
| RF27 | Criar perfil do cliente                                                | O sistema deve permitir a criação de perfis de cliente para armazenar seus dados e histórico de interações.                                                                                      | M      | 2                | X   |
| RF28 | Editar informações do cliente                                          | O sistema deve permitir a edição das informações básicas de identificação e contato dos clientes para manter os dados atualizados.                                                               | M      | 3                | X   |
| RF29 | Excluir informações do cliente                                         | O sistema deve permitir a exclusão das informações do perfil do cliente para atender solicitações de privacidade.                                                                                | M      | 3                | X   |
| RF30 | Gerar gráfico de desempenho                                            | O sistema deve gerar um gráfico com métricas como orçamento, conversões e atendimentos para apoiar o planejamento estratégico.                                                                   | W      | 1                |     |
| RF31 | Gerar gráficos comparativos financeiros                                | O sistema deve gerar gráficos de receitas vs despesas para apoiar a tomada de decisão financeira.                                                                                                | W      | 1                |     |
| RNF1 | Consultar histórico de despesas                                        | As consultas ao histórico de despesas devem ter tempo de resposta inferior a 2 segundos.                                                                                                         | M      | 3                | X   |
| RNF2 | Garantir Lei Geral de Proteção de Dados                                | A plataforma deve garantir a segurança das informações e a conformidade com a Lei Geral de Proteção de Dados (LGPD).                                                                             | M      | 10               | X   |
| RNF3 | Adaptar a diferentes telas                                             | A interface deve se adaptar dinamicamente aos tamanhos de tela: 720x1280, 1080x1920 e 1920x1080.                                                                                                 | M      | 14               | X   |
| RNF4 | Exibir categorias                                                      | A interface da página principal deverá introduzir os usuários às principais informações para as demais navegações: Portfólio da vidraçaria, além do rodapé e cabeçalho com as demais navegações. | M      | 10               | X   |
| RNF5 | Exibir calendário com disponibilidade de agendamento                   | Exibir calendário com dias e horários já ocupados e disponíveis para agendamento.                                                                                                                | M      | 4                | X   |
| RNF6 | Exibir resumo do orçamento                                             | Apresentar um resumo do orçamento solicitado pelo cliente.                                                                                                                                       | M      | 12               | X   |
| RNF7 | Exibir FAQ                                                             | Exibir uma área de dúvidas frequentes sobre serviços e processos.                                                                                                                                | M      | 7                | X   |
| RFN8 | Exibir produtos e serviços cadastrados no portfólio online da empresa.| Exibir os produtos e serviços cadastrados no portfólio online da empresa.                                                                                                                        | M      | 12               | X   |
