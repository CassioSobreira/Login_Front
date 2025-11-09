# CineBase: Frontend de Gestão de Filmes

Este é o projeto frontend da aplicação CineBase, desenvolvido em **React** com **TypeScript** e estilizado com **Tailwind CSS**. A aplicação consome duas APIs backend distintas (uma em MongoDB, outra em PostgreSQL) para gerir a autenticação de utilizadores e um CRUD completo de filmes.

Este projeto cumpre os requisitos de uma aplicação web moderna, incluindo gestão de estado global com React Context, proteção de rotas, e feedback ao utilizador (loading e notificações toast).

![Uma captura de ecrã da página de login do CineBase com um fundo de cinema](image_859dbb.jpg)
![Uma captura de ecrã do dashboard do CineBase mostrando a lista de filmes](image_38b0d9.jpg)

## Funcionalidades Principais

* **Autenticação JWT Completa:**
    * Página de Registo de Utilizador (`/register`).
    * Página de Login (`/login`) com funcionalidade "Mostrar/Esconder Senha".
    * Persistência de sessão (login continua ativo após recarregar a página) usando `localStorage`.
    * Logout (limpa o token e redireciona para o login).
* **Rotas Protegidas:**
    * A área do Dashboard (`/dashboard`) é protegida. Utilizadores não autenticados são redirecionados para `/login`.
    * A aplicação mostra um ecrã de "Carregando..." enquanto verifica o token no `localStorage`.
* **CRUD de Filmes (Dashboard):**
    * **Criar:** Formulário completo para adicionar novos filmes (título, realizador, ano, género, nota).
    * **Ler:** Lista todos os filmes pertencentes ao utilizador autenticado, mostrando a nota (rating).
    * **Atualizar:** Um modal de edição permite atualizar qualquer informação de um filme.
    * **Apagar:** Remove filmes da lista do utilizador com confirmação.
* **Navegação Aninhada (Nested Routing):**
    * O Dashboard (`/dashboard`) funciona como um layout principal.
    * A lista de filmes (`/dashboard` ou `/`) e o formulário de adição (`/dashboard/add`) são renderizados dentro deste layout.
* **Suporte a Múltiplos Backends (Adaptador):**
    * O `AuthContext` contém uma lógica de "Adaptador" que lê uma variável de ambiente (`VITE_API_TYPE`).
    * Ele traduz automaticamente as respostas dos backends MongoDB (que usa `_id`) e PostgreSQL (que usa `id`), permitindo que o mesmo código frontend funcione com ambos os bancos de dados.
* **Feedback ao Utilizador:**
    * Notificações (`toast`) para sucesso (login, criação, etc.) e erros (email duplicado, credenciais inválidas, etc.).
    * Estados de `loading` (carregamento) em todos os botões e formulários durante as chamadas à API.
    * Tratamento de erro para tokens JWT expirados (faz logout automático).

## Tecnologias Utilizadas

* **Core:** React 18+ com Vite e TypeScript
* **Estilização:** Tailwind CSS
* **Roteamento:** React Router DOM (v6+) (usando `createBrowserRouter`)
* **Notificações:** React Toastify
* **Chamadas API:** Fetch API (dentro de um wrapper no AuthContext)
* **Gestão de Estado:** React Context (para autenticação global)

## Como Executar Localmente

Siga estes passos para configurar e executar o projeto frontend no seu ambiente de desenvolvimento.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (v18 ou superior)
* [npm](https://www.npmjs.com/)
* Um dos **servidores backend** (MongoDB ou PostgreSQL) a correr localmente (ex: em `http://localhost:3000`).

### 1. Clonar e Instalar

```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/frontend-filmes-auth.git](https://github.com/seu-usuario/frontend-filmes-auth.git)

# Entre na pasta do projeto
cd frontend-filmes-auth

# Instale todas as dependências
npm install
2. Configurar Variáveis de Ambiente
Crie uma cópia do ficheiro .env.example e renomeie-a para .env na raiz do projeto.

Edite o ficheiro .env:

Snippet de código

# .env

# 1. Defina a URL da API do seu backend local
# (Verifique se o seu backend está a correr nesta porta)
VITE_API_BASE_URL=http://localhost:3000/api

# 2. Defina o tipo de backend para o "Adaptador"
# Use "postgres" se estiver a testar contra o backend PostgreSQL/Sequelize
# Use "mongo" se estiver a testar contra o backend MongoDB/Mongoose
VITE_API_TYPE=postgres
3. Executar a Aplicação
Execute o servidor de desenvolvimento Vite:

Bash

npm run dev
Abra o seu navegador e aceda a http://localhost:5173 (ou a porta indicada no terminal).

Estrutura de Pastas (Principais)
/
├── public/
│   └── images/
│       └── background-image-filmes.jpg  (Imagens de fundo)
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx     (O "segurança" das rotas)
│   ├── contexts/
│   │   └── AuthContext.tsx        (O "cérebro" da autenticação e API)
│   ├── hooks/
│   │   └── (Opcional: useLoginPageLogic.ts, etc.)
│   ├── pages/
│   │   ├── AddMoviePage.tsx       (Formulário de criação)
│   │   ├── DashboardPage.tsx      (Layout principal da área logada)
│   │   ├── LoginPage.tsx          (Página de Login)
│   │   ├── MovieList.tsx          (Lista de filmes e modal de edição)
│   │   ├── NotFoundPage.tsx       (Página 404)
│   │   └── RegisterPage.tsx       (Página de Registo)
│   ├── App.tsx                    (Define o Router e o AuthProvider)
│   ├── index.css                  (Carrega os estilos do Tailwind)
│   └── main.tsx                   (Renderiza a aplicação React)
├── .env                           (Segredos locais - NÃO COMMITAR)
├── .env.example                   (Exemplo de variáveis)
├── .gitignore
├── package.json
└── tsconfig.json
Entrega (Deploy na Vercel)
Este repositório é usado para dois deploys na Vercel, cumprindo os requisitos da tarefa:

Deploy 1: Frontend para PostgreSQL
Projeto Vercel: frontend-filmes-postgres (Exemplo)

Repositório: seu-usuario/frontend-filmes-auth

Variáveis de Ambiente na Vercel:

VITE_API_BASE_URL = https://####/api

VITE_API_TYPE = postgres

Deploy 2: Frontend para MongoDB
Projeto Vercel: frontend-filmes-mongo (Exemplo)

Repositório: seu-usuario/frontend-filmes-auth (O mesmo repositório)

Variáveis de Ambiente na Vercel:

VITE_API_BASE_URL = https://#####/api

VITE_API_TYPE = mongo