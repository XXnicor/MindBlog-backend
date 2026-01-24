## Projeto: MindBlog — Sistema de Blog com Autenticação

## Resumo
Sistema de blog onde usuários podem se cadastrar, autenticar e gerenciar artigos (criar, visualizar, editar e remover). Operações de escrita são restritas a usuários autenticados; somente o autor pode editar ou remover seus artigos. Foco no backend, organização de código e boas práticas.

## Por que é uma boa ideia (dor real)
- Muitos exemplos de blogs deixam de lado segurança e controle de autoria.
- Projeto avalia habilidades reais de backend: autenticação, autorização, persistência, upload de arquivos e organização do código.
- Demonstra domínio de CRUD com regras de negócio e clareza arquitetural útil em entrevistas técnicas.

## Stakeholders
- Usuário: cria conta, faz login e gerencia seus próprios artigos.
- Visitante: visualiza artigos públicos.
- Equipe Avaliadora: analisa código, organização, segurança e entendimento do sistema.

## Principais Features (MVP — Backend)
- Cadastro de usuário com senha criptografada (bcrypt).
- Login com geração de JWT.
- Middleware de autenticação para proteger rotas.
- CRUD de artigos:
  - criar artigo (autenticado)
  - editar artigo (somente autor)
  - remover artigo (somente autor)
  - listar artigos (público)
  - visualizar artigo por id (público)
- Upload de imagem de banner para artigo (jpg, png).
- Relacionamento entre usuário e artigos.
- Dump do banco de dados incluído no repositório.

## Skills acionadas
- Linguagem: TypeScript (strict)
- Backend: Node.js + Express
- Banco de Dados: MySQL
- Autenticação: JWT
- Segurança: bcrypt, middlewares, validação
- Testes: Jest + Supertest
- Ferramentas: Git, organização de código, SQL

## Modelo de Domínio (formato YAML — fácil para LLMs)
```yaml
User:
  id: Int (PK)
  name: String
  email: String (unique)
  passwordHash: String
  createdAt: DateTime
  updatedAt: DateTime

Article:
  id: Int (PK)
  title: String
  content: Text
  bannerPath: String | null
  authorId: Int (FK -> User.id)
  createdAt: DateTime
  updatedAt: DateTime
```

## Regras de Negócio Críticas
- RN1: Apenas usuários autenticados podem criar artigos.
- RN2: Apenas o autor do artigo pode editar ou remover.
- RN3: Senhas nunca são armazenadas em texto puro (usar bcrypt).
- RN4: `createdAt` é definido na criação e nunca alterado.
- RN5: `updatedAt` é atualizado sempre que o artigo for editado.
- RN6: Banner do artigo deve aceitar apenas imagens (jpg, png) e ter limite de tamanho.

## Endpoints essenciais (exemplos)
### Auth
- `POST /auth/register` — body: `{ "name": string, "email": string, "password": string }`
- `POST /auth/login` — body: `{ "email": string, "password": string }` → resposta: `{ "token": "JWT" }`

### Articles
- `GET /articles` — lista pública (paginada)
- `GET /articles/:id` — detalhe público
- `POST /articles` — criar artigo (auth required)
  - body (multipart): fields `{ title, content }` + file `banner`
  - response: `201 Created` com objeto do artigo
- `PUT /articles/:id` — editar (auth + autor)
  - body: `{ title?, content?, banner? }`
- `DELETE /articles/:id` — remover (auth + autor)

### Exemplo request/response
```http
POST /auth/login
Content-Type: application/json

{ "email": "a@b.com", "password": "senha" }

200 OK
{ "token": "eyJhbGci..." }
```

## Validações e códigos esperados
- `400 Bad Request`: payload inválido
- `401 Unauthorized`: token ausente/expirado
- `403 Forbidden`: usuário autenticado, mas não é autor
- `404 Not Found`: recurso inexistente
- `201 Created` / `200 OK` / `204 No Content` conforme operação

## Tech stack recomendada
- TypeScript (strict)
- Express.js
- MySQL (Prisma ou TypeORM como ORM opcional)
- JWT para autenticação
- bcrypt para hashing de senhas
- multer para upload (armazenamento local recomendado)
- dotenv para configuração
- Jest + Supertest para testes

## Estrutura de pastas sugerida
```text
src/
 ├─ controllers/
 ├─ services/
 ├─ routes/
 ├─ middlewares/
 ├─ database/
 ├─ utils/
 ├─ app.ts
 └─ server.ts
```

## MVP Backlog (ordem prática — backend)
1. Setup do projeto (Express + TypeScript).
2. Conexão com MySQL.
3. Modelagem do banco (users, articles).
4. Cadastro e login com JWT.
5. Middleware de autenticação.
6. CRUD de artigos com autorização por autor.
7. Upload de banner (validações MIME/tamanho).
8. Testes essenciais (Jest + Supertest).
9. Dump do banco e README.

## Critérios de “Pronto para Entrega”
- Backend rodando localmente sem gambiarras.
- Endpoints funcionando conforme regras de negócio.
- Senhas criptografadas.
- Autorização corretamente aplicada (somente autor edita/remove).
- Dump do banco incluído no repositório.
- Histórico de commits claros.
- README com instruções de execução e importação do dump.

## Timeline realista (1 dia — backend)
- Manhã: setup, banco, auth
- Tarde: CRUD de artigos, upload de imagem
- Noite: testes básicos, dump, README
- Estimativa: 6–8 horas focadas

## Segurança e boas práticas
- Nunca retornar `passwordHash` nas respostas.
- Tokens com expiração curta; considerar refresh tokens.
- Rate limiting nos endpoints sensíveis (login).
- Sanitizar inputs e limitar tamanho/tempo de uploads.
- Validar tipo MIME das imagens e tamanho máximo do arquivo.

## Exemplos de migrations / esquema SQL (simplificado)
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  banner_path VARCHAR(512),
  author_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

## Checklist de entrega (para o avaliador)
- [ ] Projeto em TypeScript com `tsconfig` adequado
- [ ] Endpoints de auth funcionando (register/login)
- [ ] Middleware JWT protegendo rotas
- [ ] CRUD de artigos com autorização por autor
- [ ] Upload de banner validado (jpg/png)
- [ ] Testes básicos cobrindo auth e artigos
- [ ] Dump do banco + instruções no README

---