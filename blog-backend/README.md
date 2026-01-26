# 📝 TechBlog API - Backend

API RESTful desenvolvida em **Node.js** com **Express** e **TypeScript** para gerenciar um sistema completo de blog. Oferece funcionalidades de autenticação JWT, gerenciamento de artigos com upload de imagens, sistema de comentários e perfis de usuários.

---

## 🎥 Demonstração do Sistema

<div align="center">

### 🔐 Cadastro e Login
<img src="docs/gifs/cadastro.mp4" alt="Cadastro de usuário" width="800px">
<img src="docs/gifs/login.mp4" alt="Login de usuário" width="800px">

*Registro de novos usuários e autenticação JWT com validação de credenciais*

---

### 🎬 Tour pelo Sistema
<img src="docs/gifs/tour pelo blog.mp4" alt="Tour pelo blog" width="800px">

*Visão geral das funcionalidades e navegação pelo sistema*

---

### 📝 Criação de Artigos com Upload de Imagem
<img src="docs/gifs/criação e salvamento de img.mp4" alt="Criar artigo com imagem" width="800px">

*Criação de artigos com upload de banner, categorias, tags e editor de conteúdo*

---

### ✏️ Atualização de Artigos
<img src="docs/gifs/atualizar artigo.mp4" alt="Atualizar artigo" width="800px">

*Edição de artigos existentes com atualização de conteúdo e imagens*

---

### 🗑️ Exclusão de Artigos
<img src="docs/gifs/exluir artigo.mp4" alt="Excluir artigo" width="800px">

*Remoção de artigos com confirmação e controle de permissões*

</div>

---

## 🚀 Tecnologias

Este projeto utiliza as seguintes tecnologias e bibliotecas:

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express](https://expressjs.com/)** - Framework web minimalista
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado de JavaScript
- **[MySQL2](https://github.com/sidorares/node-mysql2)** - Cliente MySQL para Node.js
- **[JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)** - Autenticação via tokens
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas
- **[Multer](https://github.com/expressjs/multer)** - Upload de arquivos (imagens de artigos e avatares)
- **[Cors](https://github.com/expressjs/cors)** - Middleware para habilitar CORS
- **[Dotenv](https://github.com/motdotla/dotenv)** - Gerenciamento de variáveis de ambiente
- **[Jest](https://jestjs.io/)** - Framework de testes

---

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** (versão 16 ou superior)
- **[MySQL](https://www.mysql.com/)** (versão 8 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)

---

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd blog-backend
```

2. Instale as dependências:
```bash
npm install
```

---

## 🗄️ Configuração do Banco de Dados

### Passo 1: Criar o banco de dados

Acesse o MySQL e crie o banco de dados:

```sql
CREATE DATABASE mindgroup_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Passo 2: Importar as tabelas

Execute o script SQL localizado em `scripts/migrations.sql` para criar todas as tabelas necessárias:

```bash
# No terminal do MySQL
mysql -u seu_usuario -p mindgroup_blog < scripts/migrations.sql
```

**Ou** execute o script automatizado:

```bash
# No Windows (PowerShell ou CMD)
cd scripts
run-migrations.bat
```

Isso criará as tabelas:
- `users` - Usuários do sistema
- `articles` - Artigos do blog
- `comments` - Comentários dos artigos

---

## ⚙️ Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=mindgroup_blog

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d

# Upload
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880
```

> ⚠️ **Importante**: Nunca commit o arquivo `.env` no repositório. Ele já está incluído no `.gitignore`.

---

## 🎯 Como Rodar

### Modo Desenvolvimento (com hot-reload)

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3001` (ou na porta definida no `.env`).

### Modo Produção

```bash
# 1. Compilar TypeScript para JavaScript
npm run build

# 2. Executar a versão compilada
npm start
```

---

## 📡 Endpoints da API

### 🔐 Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/register` | Cadastrar novo usuário | ❌ |
| POST | `/api/auth/login` | Login (retorna JWT) | ❌ |
| GET | `/api/auth/me` | Dados do usuário autenticado | ✅ |

### 👤 Usuários (`/api/users`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/users` | Listar todos os usuários | ❌ |
| GET | `/api/users/:id` | Buscar usuário por ID | ❌ |
| GET | `/api/users/stats` | Estatísticas do usuário | ✅ |
| PUT | `/api/users/profile` | Atualizar perfil (com avatar) | ✅ |
| PUT | `/api/users/:id` | Atualizar usuário | ❌ |
| DELETE | `/api/users/:id` | Deletar usuário | ❌ |

### 📰 Artigos (`/api/articles`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/articles` | Listar artigos (com paginação) | ❌ |
| GET | `/api/articles/:id` | Buscar artigo por ID | ❌ |
| POST | `/api/articles` | Criar novo artigo (com imagem) | ✅ |
| PUT | `/api/articles/:id` | Atualizar artigo | ✅ |
| DELETE | `/api/articles/:id` | Deletar artigo | ✅ |

**Query Params para GET `/api/articles`:**
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 9)
- `categoria` - Filtrar por categoria
- `search` - Buscar por título/conteúdo

### 💬 Comentários (`/api/comments`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/articles/:id/comments` | Listar comentários de um artigo | ❌ |
| POST | `/api/articles/:id/comments` | Criar comentário | ✅ |
| DELETE | `/api/comments/:id` | Deletar comentário | ✅ |

---

## 📂 Observações sobre Uploads

- A pasta `uploads/` armazena as imagens enviadas (banners de artigos e avatares)
- **Permissões**: Certifique-se de que a pasta tem permissão de escrita
- **Acesso**: As imagens ficam disponíveis via `/uploads/<nome-do-arquivo>`
- **Limite**: Tamanho máximo de arquivo configurado em `MAX_FILE_SIZE` no `.env` (padrão: 5MB)

**Exemplo de URL de imagem:**
```
http://localhost:3001/uploads/1769388221050-5ef88c05d0989e81071be6ad0db74890.jpg
```

---

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

---

## 📁 Estrutura do Projeto

```
blog-backend/
├── src/
│   ├── config/          # Configurações (env, database)
│   ├── controllers/     # Controladores (lógica das rotas)
│   ├── database/        # Conexão com banco de dados
│   ├── middlewares/     # Middlewares (auth, upload, errors)
│   ├── models/          # Modelos/Entidades
│   ├── repositories/    # Camada de acesso aos dados
│   ├── routes/          # Definição das rotas
│   ├── services/        # Regras de negócio
│   ├── types/           # Tipos TypeScript
│   └── utils/           # Funções utilitárias
├── scripts/             # Scripts de migração do banco
├── uploads/             # Pasta de arquivos enviados
├── Main.ts              # Arquivo principal do servidor
├── .env                 # Variáveis de ambiente (não versionado)
└── package.json         # Dependências e scripts
```

---

## 🔒 Segurança

- Senhas são criptografadas com **bcrypt** antes de serem salvas
- Autenticação via **JWT** com expiração configurável
- Validação de dados de entrada em todas as rotas
- Headers CORS configurados para aceitar apenas origens permitidas
- Tratamento centralizado de erros

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **ISC**.

---

## 👨‍💻 Desenvolvido por

**MindGroup Technologies**

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique os logs do servidor no console
2. Confirme se o banco de dados está rodando
3. Valide as variáveis de ambiente no `.env`
4. Certifique-se de que a pasta `uploads/` existe e tem permissão de escrita

**Logs úteis:**
- `[ArticleController]` - Logs de operações com artigos
- `[AuthMiddleware]` - Logs de autenticação
- `[ArticleRepository]` - Logs de queries ao banco

---

**Status do Projeto**: 🟢 Em Desenvolvimento Ativo
