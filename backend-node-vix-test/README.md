# Teste Técnico Vituax - Backend

Este documento descreve os **primeiros passos**, **configuração do ambiente**, **execução em desenvolvimento**, **build** e **validações mínimas** necessárias para rodar o backend do projeto.

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Setup inicial do ambiente](#setup-inicial-do-ambiente)
- [Execução em modo desenvolvimento](#execução-em-modo-desenvolvimento)
- [Build e execução do build](#build-e-execução-do-build)
- [Validações mínimas](#validações-mínimas)
- [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js (versão LTS)
- npm
- Docker
- Docker Compose

---

## Setup inicial do ambiente

### 1) Instalação das dependências

Acesse o diretório do backend:

```bash
cd backend-node-vix-test
```

Instale as dependências do projeto:

```bash
npm install
```

---

### 2) Variáveis de ambiente

Crie o arquivo `.env` a partir do arquivo de exemplo:

```bash
cp .env.example .env
```

Verifique se a variável `DATABASE_URL` está configurada corretamente, apontando para a porta utilizada pelo MySQL no projeto.

Exemplo de configuração:

```env
DATABASE_URL=mysql://root:password@localhost:3312/test-cloud-db
```

---

### 3) Subir banco de dados (MySQL via Docker)

Suba apenas o banco de dados MySQL:

```bash
npm run db:up
```

Valide se o container está em estado saudável (`healthy`):

```bash
docker ps --filter "name=mysql-test-cloud" --format "table {{.Names}}\t{{.Status}}"
docker inspect -f '{{.State.Health.Status}}' mysql-test-cloud
```

O status esperado é:

```text
healthy
```

---

### 4) Prisma (gerar client, aplicar migrations e seed)

Com o banco de dados em estado saudável, execute:

```bash
npx prisma generate
npx prisma migrate reset
```

Este processo irá:

- Gerar o Prisma Client
- Recriar o schema do banco
- Executar as migrations
- Popular o banco com dados de seed (ambiente local)

Este é o fluxo recomendado para ambientes de desenvolvimento.

Opcionalmente, o Prisma Studio pode ser utilizado para inspecionar os dados:

```bash
npx prisma studio
```

---

## Execução em modo desenvolvimento

Inicie a aplicação em modo desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3001
```

---

## Validações mínimas

Com o backend em execução, valide os seguintes pontos:

### Endpoint principal

```bash
curl -i "http://localhost:3001/api/v1/vm?limit=20"
```

Resultado esperado:

- Status HTTP `200`
- Resposta JSON contendo:
  - `totalCount`
  - `result`

### Validação das variáveis de ambiente

```bash
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

O valor impresso deve corresponder à configuração definida no `.env`.

---

## Build e execução do build

### Execução dos testes

Para rodar os testes automatizados:

```bash
npm test
```

---

### Gerar build

```bash
npm run build
```

---

### Executar build (modo produção local)

```bash
npm run start
```

Opcionalmente, caso exista script de lint configurado:

```bash
npm run lint
```

---

## Troubleshooting

### Banco de dados não fica `healthy`

- Verifique os logs do container MySQL:

```bash
docker logs --tail 100 mysql-test-cloud
```

- Caso necessário, recrie o container e o volume do banco local (os dados serão removidos):

```bash
docker compose -f docker-compose-db.yml down -v
npm run db:up
```

---

### Prisma falha com erro de schema, tabelas ou seed

- Verifique se o banco está em estado `healthy`
- Reexecute o fluxo do Prisma:

```bash
npx prisma generate
npx prisma migrate reset
```

---

## Autenticação

### Registro de usuário

Endpoint responsável por criar um novo usuário no sistema.

**URL**

```
POST /api/v1/auth/register
```

**Headers**

```
Content-Type: application/json
```

**Body (JSON)**

```json
{
  "username": "NomeUsuario",
  "email": "email@example.com",
  "password": "senhaSegura123",
  "role": "member"
}
```

**Campos obrigatórios**

* username
* email
* password
* role

**Regras**

* O email deve ser único
* O username deve ser único
* A senha nunca é armazenada em texto puro (hash com bcrypt)
* Validação de dados realizada com Zod

**Resposta de sucesso (201)**

```json
{
  "idUser": "uuid",
  "username": "NomeUsuario",
  "email": "email@example.com",
  "role": "member",
  "isActive": true,
  "createdAt": "2026-01-12T08:54:13.000Z"
}
```

**Possíveis erros**

* 409 Conflict – Email já cadastrado
* 409 Conflict – Username já cadastrado
* 400 Bad Request – Dados inválidos
