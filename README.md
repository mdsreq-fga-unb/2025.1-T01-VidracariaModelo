# 2025.1-T01-VidracariaModelo
Repositório de projeto da disciplina de REQ-T1.
-----


## Como Rodar o Projeto com Docker Compose

Este projeto utiliza **Docker** e **Docker Compose** para facilitar a configuração e execução. Siga os passos abaixo para iniciar a aplicação:

### Pré-requisitos

---
Ótimo ponto! Para garantir que usuários de Linux também possam instalar o Docker corretamente, podemos adicionar um link específico para eles.

Aqui está a seção "Pré-requisitos" atualizada com links para **Docker Desktop** (para Windows/macOS) e **Docker Engine** (para Linux), formatada em Markdown:

---

## Pré-requisitos

Certifique-se de ter o Docker instalado e rodando em sua máquina.

* Para **Windows e macOS**: [Instale o Docker Desktop](https://www.docker.com/products/docker-desktop). Ele inclui tudo o que você precisa.
* Para **Linux**: [Instale o Docker Engine](https://docs.docker.com/engine/install/). Siga as instruções específicas para a sua distribuição Linux.

---


### 1\. Clone o Repositório

Primeiro, clone o repositório do projeto para a sua máquina local:

```bash
git clone <URL_DO_REPOSITORIO>
cd <cd 2025.1-T01-VidracariaModelo> 

### 2\. Inicie os Serviços com Docker Compose

Na pasta raiz do projeto (onde está o arquivo `docker-compose.yml`), execute o comando para construir as imagens e iniciar os contêineres:

```bash
docker compose --env-file ./backend/.env up --build
```

  * **Este comando irá automaticamente instalar as dependências de cada serviço dentro dos contêineres.**
  * `--build`: Garante que as imagens Docker sejam construídas (ou atualizadas) com a versão mais recente do seu código.
  * `-d`: Inicia os serviços em segundo plano, liberando o terminal.

-----

### Observação: `npm install` na sua Máquina Local

Embora o Docker se encarregue de instalar as dependências dentro dos contêineres, você pode ver tutoriais que instruem a rodar `npm install` diretamente na sua máquina (ex: dentro da pasta `backend`).

**O `npm install` na sua máquina local é útil para:**

  * **Desenvolvimento e Depuração:** Se você precisar rodar ou testar partes do projeto diretamente no seu computador, fora do ambiente Docker.
  * **Ferramentas de Desenvolvimento:** Algumas ferramentas de desenvolvimento ou editores de código podem precisar das dependências locais para funcionar corretamente (ex: autocomplete, linting).
  * **Atualizar `package-lock.json`:** Garante que seu `package-lock.json` (que o Docker usa para instalações consistentes) esteja sempre atualizado com as dependências testadas localmente.

No entanto, para **apenas levantar o projeto com Docker Compose**, não é estritamente necessário executar `npm install` no seu computador.

-----

### 3\. Verifique se os Serviços Estão Rodando

Você pode verificar o status dos contêineres com:

```bash
docker compose ps
```

Ambos `backend` e `frontend` devem aparecer como `Up`.

### 4\. Acesse a Aplicação

  * **Frontend (Aplicação Web):** Abra seu navegador e acesse:
    [http://localhost/](https://www.google.com/search?q=http://localhost/)

  * **Backend (API):** Para verificar a API, acesse este endpoint no seu navegador ou via Postman/Insomnia:
    [http://localhost:3000/users](https://www.google.com/search?q=http://localhost:3000/users)

### 5\. Parar os Serviços (Quando Terminar)

Para parar e remover os contêineres (as imagens permanecerão para uso futuro):

```bash
docker compose down
```

-----

