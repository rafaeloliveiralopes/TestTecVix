# Teste Técnico Vituax - Frontend

Este documento descreve os **primeiros passos**, **configuração do ambiente**, **execução em desenvolvimento**, **build** e **validações mínimas** necessárias para rodar o frontend do projeto.

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Setup inicial do ambiente](#setup-do-ambiente-do-zero)
- [Execução em modo desenvolvimento](#execução-em-modo-desenvolvimento)
- [Build e execução do build](#build-e-execução-do-build)
- [Validações mínimas](#validações-mínimas)
- [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js (versão LTS)
- npm

Observação: o frontend depende do backend em execução para funcionamento completo.

---

## Setup inicial do ambiente

### 1) Instalação das dependências

Acesse o diretório do frontend:

```bash
cd frontend-react-vix-test
```

Instale as dependências do projeto:

```bash
npm install
```

---

### 2) Variáveis de ambiente

Crie o arquivo `.env` a partir do arquivo de exemplo:

```bash
cp .env.exemple .env
```

Configure a URL base da API conforme o backend local:

```env
VITE_BASE_URL=http://localhost:3001/api/v1
```

Observação: alterações no arquivo `.env` exigem reinicialização do servidor de desenvolvimento.

---

## Execução em modo desenvolvimento

Inicie a aplicação em modo desenvolvimento:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:3000
```

---

## Validações mínimas

Com o frontend em execução, valide os seguintes pontos:

- A aplicação carrega sem erros no navegador
- As chamadas para a API utilizam a URL configurada em `VITE_BASE_URL`
- A lista de VMs é renderizada corretamente na tela inicial
- Não há erros de `404` ou `500` no console do navegador durante a navegação inicial

Opcionalmente, validar via DevTools (Network):

- Requisições para `/api/v1/*` retornam status `200`

---

## Build e execução do build

### Gerar build

```bash
npm run build
```

O comando gera os arquivos de produção no diretório padrão de build.

---

### Executar build (preview local)

```bash
npm run preview
```

A aplicação em modo preview ficará disponível em:

```text
http://localhost:4173
```

---

## Troubleshooting

### Aplicação não carrega ou apresenta tela em branco

- Verifique se o backend está em execução
- Confirme a configuração da variável `VITE_BASE_URL`
- Reinicie o servidor de desenvolvimento após alterações no `.env`

---

### Erros de requisição para a API (Network error, 404 ou 500)

- Verifique se o backend está acessível em `http://localhost:3001`
- Confirme se a URL base da API está correta no `.env`
- Verifique o console do navegador para mensagens de erro

---

### Redirecionamento incorreto ou erro de rota

- Verifique a configuração das rotas no React Router
- Confirme se as rotas `/login` e `/register` estão registradas quando utilizadas

---
