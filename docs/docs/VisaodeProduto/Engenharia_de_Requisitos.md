## *Elicitação e Descoberta*

### 🧠 Brainstorming
Técnica de geração livre de ideias, usada para levantar funcionalidades, problemas ou soluções com a participação de stakeholders, desenvolvedores e usuários.

**Objetivo:** explorar diferentes visões, mesmo sem filtrar ou julgar.

---

### 🤖 Prompt IA
Uso de ferramentas de IA (como ChatGPT) para explorar ideias iniciais, levantar possíveis funcionalidades, ou simular entrevistas com clientes ou usuários.

**Objetivo:** acelerar a geração de requisitos iniciais com apoio automatizado.

---

### 👥 Entrevista com o cliente
Conversa estruturada ou semiestruturada com stakeholders para entender necessidades, problemas e objetivos do sistema.

**Objetivo:** captar requisitos diretos da fonte.

---

## *Análise e Consenso*

### 🧠 Brainstorming
Usado aqui para *discutir* e *refinar* requisitos levantados, promovendo uma visão compartilhada entre stakeholders e equipe.

---

### 👥 Entrevista
Aprofundamento nas entrevistas anteriores para esclarecer requisitos complexos, técnicos ou sensíveis.

---

### 🤝 Negociação
Processo de ajustar requisitos conflitantes ou que excedem recursos disponíveis (tempo, custo, tecnologia).

**Exemplo:** o cliente quer uma funcionalidade agora, mas ela será priorizada para a próxima versão por impacto no cronograma.

---

### 🤖 Prompt IA
Auxílio na análise de requisitos, verificação de clareza, identificação de possíveis inconsistências ou lacunas.

## *Declaração*

### 📄 Documento de Visão de Produto
Documento que descreve o propósito, escopo, público-alvo e funcionalidades principais do sistema.  
*Serve como norteador estratégico do projeto.*

## 📑 Especificação de Requisitos ARO (Atores, Requisitos e Objetivos)

| **Elemento** | **Descrição** |
|--------------|---------------|
| **Ação**     | O que o sistema fará (verbo no infinitivo: cadastrar, listar, validar, emitir, etc.). |
| **Recurso**  | Qual entidade ou item será manipulado (ex: cliente, pedido, agendamento, recibo). |
| **Objetivo** | Qual é a finalidade do requisito (ex: para registrar vendas, para controle financeiro, para histórico do cliente). |

---

## *Representação*

### 📊 Diagramas

Incluem:

- *Diagrama Entidade Relacionamento (DER)*
- *Diagrama lógico do Banco de Dados*
- *Diagramas de fluxo de uso*

### 🖼️ Prototipagem

Criação de *interfaces simuladas* (alta fidelidade) para validar requisitos com usuários antes da codificação.  
**Ferramenta:** Figma.

---

## *Verificação e Validação*

### 🔍 Análise de Qualidade de Requisitos

Avaliação se os requisitos são **completos, consistentes, claros, testáveis, rastreáveis** e **sem ambiguidade**.

### ✅ Definition of Done (DoD)

Critérios que definem quando um requisito está completamente implementado e pronto para entrega.  
**Exemplo:** Testado, documentado, aprovado pelo PO.

### 🟡 Definition of Ready (DoR)

Critérios mínimos para que um requisito esteja pronto para ser implementado.  
**Exemplo:** Está bem descrito, tem critérios de aceitação, foi priorizado.

### 🤖 Prompt IA

Validação automática ou semi-automática de requisitos: clareza, ambiguidade, exemplos de teste.

### 👥 Revisão por Pares

Membros da equipe revisam requisitos uns dos outros para verificar coerência, viabilidade e clareza.

### 🧪 Inspeção

Técnica formal e mais rigorosa de revisão, feita em grupo e seguindo um roteiro.

### 🧠 DEEP (Backlog DEEP – *Detailed, Emergent, Estimated, Prioritized*)

Critérios para manter um backlog saudável:

| Letra | Significado                                        |
|-------|-----------------------------------------------------|
| D     | Detalhado o suficiente                              |
| E     | Requisitos emergem conforme entendimento cresce     |
| E     | Estimado com esforço ou pontos                      |
| P     | Priorizado por valor e necessidade                  |

---

## *Organização e Atualização*



### 🗂️ MoSCoW – Técnica de Priorização

| Letra | Significado                 |
|-------|-----------------------------|
| M     | Must have (deve ter)       |
| S     | Should have (deveria ter)  |
| C     | Could have (poderia ter)   |
| W     | Won’t have (não terá agora)|

---

### 📊 Pontos por Histórias: WSJF (Weighted Shortest Job First)

Usado para priorizar requisitos com base em **valor de negócio, urgência, risco e esforço**.  
**Fórmula:**

**WSJF = (Valor do negócio + Urgência + Redução de risco) / Tamanho (Esforço)**

Mais alto = maior prioridade.

---


| **Fases do Processo** | **Atividades ER** | **Prática** | **Técnica** | **Resultado Esperado** |
|:-----------------------------|:---------------------------------------|:------------------------------------------|:---------------------------------------------------------------------------|:-------------------------------------------------------------------------|
| **Planejamento de requisitos** | Elicitação e Descoberta | Elicitação de requisitos | Brainstorming, Prompt IA, Entrevista com cliente | Identificação de requisitos |
|                                | Análise e Consenso |  Priorização dos Requisitos | MosCow, wsjf, Entrevista, Prompt IA | Priorização atribuindo um valor técnico aos requisitos |
|                                | Declaração | Registro dos Requisitos | Especificação de requisitos ARO | Requisitos registrados de forma clara e concisa |
|                                | Organização e Atualização | Construção do Backlog | DEEP | Organização dos requisitos resultando em um Backlog  |
|                                | Verificação e Validação | Verificação e validação dos requisitos | Prompt IA, Revisão por pares, Análise de qualidade de requisitos| Organização dos requisitos resultando em um Backlog  |
| **User Design** | Representação  | Criação de Protótipos | Prototipagem, Diagramas | Protótipos e diagramas que deverão representar os requisitos e como eles devem agir  |
|                 | Verificação e Validação  | Validação dos protótipos com base nos requisitos |Análise de Qualidade de Requisitos, DoR, revisão por pares| Confirmação que os requisitos estão prontos para o desenvolvimento  |
|                 | Organização e atualização  | Priorização e detalhamento dos requisitos |MosCoW, Wjsf | Revisão dos requisitos a partir dos protótipos  |
| **Construção** | Verificação e validação  | Inspeção | Revisão por pares | Encontrar defeitos e problemas  |
|                | Verificação e validação de produto  | Inspeção | DoD | Validar o produto desenvolvido  |

## Histórico de Versões

| Data       | Versão | Descrição                          | Autor         | Revisores               |
|------------|-----|------------------------------------|----------------|--------------------------|
| 19/04/2025 | 1.0 | Criação do documento               | Samara Alves  | Maria Eduarda |
| 26/05/2025 | 1.1 | Atualizações e alterações |Igor Daniel, Pedro Henrique   | Cayo Alencar         |
| 13/07/2025 | 1.2 | Atualizações e alterações |Samara Alves   | Maria Eduarda         |

