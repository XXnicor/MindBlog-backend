# 📋 Requisitos do Backend - Blog Frontend

Este documento descreve todos os requisitos que o backend precisa implementar para integração completa com o frontend.

---

## 🌐 Configuração Geral

### URL Base da API
```
http://localhost:5000/api
```

### CORS (Cross-Origin Resource Sharing)
O backend precisa aceitar requisições do frontend:

```javascript
// Node.js/Express exemplo
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Headers de Autenticação
Todas as requisições autenticadas incluem:
```
Authorization: Bearer <token_jwt>
```

---

## 🔐 Autenticação

### 1. Registro de Usuário
**Endpoint:** `POST /api/auth/register`

**Body (JSON):**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta Sucesso (201):**
```json
{
  "data": {
    "id": "user_id",
    "nome": "João Silva",
    "email": "joao@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Body (JSON):**
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta Sucesso (200):**
```json
{
  "data": {
    "id": "user_id",
    "nome": "João Silva",
    "email": "joao@example.com",
    "avatar": "https://url-do-avatar.com/avatar.jpg",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Resposta Erro (401):**
```json
{
  "message": "Email ou senha incorretos"
}
```

---

### 3. Obter Usuário Logado
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta Sucesso (200):**
```json
{
  "data": {
    "id": "user_id",
    "nome": "João Silva",
    "email": "joao@example.com",
    "avatar": "https://url-do-avatar.com/avatar.jpg",
    "bio": "Desenvolvedor Full Stack"
  }
}
```

---

## 📝 Artigos

### 1. Listar Todos os Artigos
**Endpoint:** `GET /api/articles`

**Query Parameters (Opcionais):**
```
?page=1&limit=10&categoria=Dev&search=react
```

**Resposta Sucesso (200):**
```json
{
  "data": {
    "articles": [
      {
        "id": "1",
        "titulo": "Introdução ao React 19",
        "resumo": "Explore as novidades do React 19...",
        "categoria": "Dev",
        "conteudo": "O React 19 chegou com mudanças...",
        "tags": ["React", "JavaScript", "Frontend"],
        "imagem_url": "https://url-da-imagem.com/imagem.jpg",
        "autor": {
          "id": "author_id",
          "nome": "Ana Silva",
          "avatar": "https://avatar.com/ana.jpg"
        },
        "views": 1250,
        "likes": 89,
        "commentsCount": 12,
        "createdAt": "2025-01-20T10:00:00Z",
        "updatedAt": "2025-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

---

### 2. Buscar Artigo por ID
**Endpoint:** `GET /api/articles/:id`

**Exemplo:** `GET /api/articles/1`

**Resposta Sucesso (200):**
```json
{
  "data": {
    "id": "1",
    "titulo": "Introdução ao React 19",
    "resumo": "Explore as novidades do React 19...",
    "categoria": "Dev",
    "conteudo": "# Introdução\n\nO React 19 chegou...",
    "tags": ["React", "JavaScript", "Frontend"],
    "imagem_url": "https://url-da-imagem.com/imagem.jpg",
    "autor": {
      "id": "author_id",
      "nome": "Ana Silva",
      "avatar": "https://avatar.com/ana.jpg",
      "bio": "Desenvolvedora Frontend"
    },
    "views": 1250,
    "likes": 89,
    "commentsCount": 12,
    "createdAt": "2025-01-20T10:00:00Z",
    "updatedAt": "2025-01-20T10:00:00Z"
  }
}
```

**Resposta Erro (404):**
```json
{
  "message": "Artigo não encontrado"
}
```

---

### 3. Criar Novo Artigo
**Endpoint:** `POST /api/articles`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (FormData):**
```
titulo: "Introdução ao React 19"
resumo: "Explore as novidades do React 19..."
categoria: "Dev" | "DevOps" | "IA"
conteudo: "# Introdução\n\nO React 19..."
tags: '["React", "JavaScript", "Frontend"]'  // JSON string
imagem: File  // Arquivo de imagem (opcional)
```

**Resposta Sucesso (201):**
```json
{
  "data": {
    "id": "1",
    "titulo": "Introdução ao React 19",
    "resumo": "Explore as novidades do React 19...",
    "categoria": "Dev",
    "conteudo": "# Introdução\n\nO React 19...",
    "tags": ["React", "JavaScript", "Frontend"],
    "imagem_url": "uploads/2026/01/imagem.jpg",
    "autor": {
      "id": "author_id",
      "nome": "João Silva"
    },
    "views": 0,
    "likes": 0,
    "commentsCount": 0,
    "createdAt": "2026-01-25T10:00:00Z"
  }
}
```

**Resposta Erro (401):**
```json
{
  "message": "Token inválido ou expirado"
}
```

**Resposta Erro (400):**
```json
{
  "message": "Campos obrigatórios faltando",
  "errors": {
    "titulo": "Título é obrigatório",
    "conteudo": "Conteúdo é obrigatório"
  }
}
```

---

### 4. Editar Artigo
**Endpoint:** `PUT /api/articles/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (FormData):**
```
titulo: "Introdução ao React 19 - Atualizado"
resumo: "Explore as novidades..."
categoria: "Dev"
conteudo: "# Introdução Atualizada..."
tags: '["React", "JavaScript"]'
imagem: File  // Novo arquivo (opcional)
```

**Resposta Sucesso (200):**
```json
{
  "data": {
    "id": "1",
    "titulo": "Introdução ao React 19 - Atualizado",
    "resumo": "Explore as novidades...",
    "categoria": "Dev",
    "conteudo": "# Introdução Atualizada...",
    "tags": ["React", "JavaScript"],
    "imagem_url": "uploads/2026/01/nova-imagem.jpg",
    "updatedAt": "2026-01-25T11:00:00Z"
  }
}
```

**Resposta Erro (403):**
```json
{
  "message": "Você não tem permissão para editar este artigo"
}
```

---

### 5. Deletar Artigo
**Endpoint:** `DELETE /api/articles/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta Sucesso (200):**
```json
{
  "data": {
    "message": "Artigo deletado com sucesso"
  }
}
```

**Resposta Erro (403):**
```json
{
  "message": "Você não tem permissão para deletar este artigo"
}
```

---

## 💬 Comentários

### 1. Listar Comentários de um Artigo
**Endpoint:** `GET /api/articles/:id/comments`

**Resposta Sucesso (200):**
```json
{
  "data": [
    {
      "id": "1",
      "text": "Ótimo artigo! Muito bem explicado.",
      "author": {
        "name": "Carlos Santos",
        "avatar": "https://avatar.com/carlos.jpg"
      },
      "likes": 15,
      "date": "2025-01-21T14:30:00Z"
    }
  ]
}
```

---

### 2. Criar Comentário
**Endpoint:** `POST /api/articles/:id/comments`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "text": "Ótimo artigo! Muito bem explicado."
}
```

**Resposta Sucesso (201):**
```json
{
  "data": {
    "id": "1",
    "text": "Ótimo artigo! Muito bem explicado.",
    "author": {
      "name": "João Silva",
      "avatar": "https://avatar.com/joao.jpg"
    },
    "likes": 0,
    "date": "2026-01-25T10:00:00Z"
  }
}
```

---

## 👤 Perfil de Usuário

### 1. Atualizar Perfil
**Endpoint:** `PUT /api/users/profile`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (FormData):**
```
nome: "João Silva"
email: "joao.novo@example.com"
bio: "Desenvolvedor Full Stack"
avatar: File  // Novo avatar (opcional)
senha_atual: "senha123"  // Obrigatório se mudar senha
senha_nova: "novaSenha123"  // Opcional
```

**Resposta Sucesso (200):**
```json
{
  "data": {
    "id": "user_id",
    "nome": "João Silva",
    "email": "joao.novo@example.com",
    "bio": "Desenvolvedor Full Stack",
    "avatar": "uploads/avatars/joao.jpg"
  }
}
```

---

## 📊 Dashboard (Estatísticas)

### 1. Obter Estatísticas do Usuário
**Endpoint:** `GET /api/users/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta Sucesso (200):**
```json
{
  "data": {
    "totalArticles": 12,
    "totalViews": 8543,
    "totalLikes": 456,
    "totalComments": 89
  }
}
```

---

## 📤 Upload de Arquivos

### Configuração de Upload

O backend deve aceitar upload de imagens com:

- **Tamanho máximo:** 5MB
- **Formatos aceitos:** JPG, JPEG, PNG, GIF, WEBP
- **Pasta de destino:** `uploads/` ou similar
- **Nome do campo:** `imagem`

**Exemplo com Multer (Node.js):**
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Apenas imagens são permitidas'));
  }
});
```

---

## 🔍 Códigos de Status HTTP

### Sucesso
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Sucesso sem conteúdo de resposta

### Erro do Cliente
- `400 Bad Request` - Dados inválidos ou faltando
- `401 Unauthorized` - Token inválido ou ausente
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: email já cadastrado)
- `422 Unprocessable Entity` - Validação falhou

### Erro do Servidor
- `500 Internal Server Error` - Erro interno do servidor

---

## 🛡️ Segurança

### Token JWT
- **Expiração:** 7 dias
- **Secret:** Use variável de ambiente
- **Payload mínimo:**
```json
{
  "id": "user_id",
  "email": "user@example.com"
}
```

### Validações Obrigatórias
- **Email:** Formato válido e único
- **Senha:** Mínimo 6 caracteres
- **Título:** 5-200 caracteres
- **Resumo:** Máximo 120 caracteres
- **Conteúdo:** Mínimo 100 caracteres

### Permissões
- Apenas o autor pode editar/deletar seus artigos
- Apenas usuários autenticados podem criar artigos
- Apenas usuários autenticados podem comentar

---

## 📦 Variáveis de Ambiente (.env)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
DB_USER=postgres
DB_PASSWORD=senha

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

---

## ✅ Checklist de Implementação

- [ ] Configurar CORS para aceitar requisições do frontend
- [ ] Implementar autenticação com JWT
- [ ] Criar rotas de registro e login
- [ ] Criar CRUD completo de artigos
- [ ] Implementar upload de imagens
- [ ] Criar sistema de comentários
- [ ] Adicionar validações em todos os endpoints
- [ ] Implementar paginação na listagem de artigos
- [ ] Adicionar middleware de autenticação
- [ ] Configurar tratamento de erros global
- [ ] Implementar rate limiting (opcional mas recomendado)
- [ ] Adicionar logs de requisições
