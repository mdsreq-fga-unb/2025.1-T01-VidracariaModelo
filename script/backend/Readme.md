# Documentação da API de Agendamento

Esta API gerencia clientes, horários disponíveis e agendamentos para um sistema de marcação de horários.

---

## 1. Horários Disponíveis

### GET `/horarios-disponiveis?data=YYYY-MM-DD`
- **Recebe:**  
  - Query param `data` (string, obrigatório, formato `YYYY-MM-DD`)
- **Retorna:**  
  - Lista JSON dos horários disponíveis (`id_horario`, `horario_inicio`, `horario_fim`)

---

## 2. Clientes (CRUD Completo)

### GET `/clientes`
- **Recebe:**  
  - Nada
- **Retorna:**  
  - Lista JSON de todos os clientes

### GET `/clientes/:id`
- **Recebe:**  
  - Parâmetro URL `id` (ID do cliente)
- **Retorna:**  
  - JSON do cliente encontrado ou erro 404

### POST `/clientes`
- **Recebe:**  
  - JSON no corpo com os campos:  
    - `nome` (string, obrigatório)  
    - `email` (string, obrigatório)  
    - `telefone` (string, opcional)
- **Retorna:**  
  - JSON do cliente criado ou erro

### PUT `/clientes/:id`
- **Recebe:**  
  - Parâmetro URL `id` (ID do cliente)  
  - JSON no corpo com os campos:  
    - `nome` (string, obrigatório)  
    - `email` (string, obrigatório)  
    - `telefone` (string, opcional)
- **Retorna:**  
  - JSON do cliente atualizado ou erro

### DELETE `/clientes/:id`
- **Recebe:**  
  - Parâmetro URL `id` (ID do cliente)
- **Retorna:**  
  - Confirmação JSON de exclusão ou erro

---

## 3. Agendamentos

### POST `/`
- **Recebe:**  
  - JSON no corpo com:  
    - `id_cliente` (int)  
    - `data` (string, `YYYY-MM-DD`)  
    - `horario` (string, ex: `"09:00"`)  
    - `observacoes` (string, opcional)
- **Retorna:**  
  - JSON do agendamento criado ou erro se horário ocupado

### GET `/`
- **Recebe:**  
  - Query param opcional `data` para filtrar agendamentos
- **Retorna:**  
  - Lista JSON de agendamentos (com dados do cliente)

### PUT `/:id`
- **Recebe:**  
  - Parâmetro URL `id` (ID do agendamento)  
  - JSON no corpo com novos dados:  
    - `data` (string)  
    - `horario` (string)  
    - `observacoes` (string)
- **Retorna:**  
  - JSON do agendamento atualizado ou erro

### DELETE `/:id`
- **Recebe:**  
  - Parâmetro URL `id` (ID do agendamento)
- **Retorna:**  
  - Confirmação JSON de cancelamento ou erro

---

## Notas Gerais

- Todas as respostas são em JSON.
- Em caso de erro, o formato da resposta é:
```json
{
  "error": "Mensagem do erro"
}
```
