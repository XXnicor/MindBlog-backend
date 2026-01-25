# 🗄️ GUIA DE ATUALIZAÇÃO DO BANCO DE DADOS

## 📋 O que será adicionado ao banco:

### **Tabela `users`** (2 novas colunas)
- ✅ `avatar` VARCHAR(255) - URL/caminho do avatar do usuário
- ✅ `bio` TEXT - Biografia do usuário

### **Tabela `articles`** (5 novas colunas)
- ✅ `resumo` VARCHAR(200) - Resumo do artigo
- ✅ `categoria` VARCHAR(50) - Categoria (Dev, DevOps, IA)
- ✅ `tags` JSON - Array de tags em formato JSON
- ✅ `views` INT - Contador de visualizações
- ✅ `likes` INT - Contador de likes

### **Tabela `comments`** (nova tabela)
- ✅ `id` INT PRIMARY KEY
- ✅ `text` TEXT - Texto do comentário
- ✅ `id_article` INT - ID do artigo
- ✅ `id_author` INT - ID do autor
- ✅ `likes` INT - Contador de likes
- ✅ `created_at` TIMESTAMP
- ✅ `updated_at` TIMESTAMP

---

## 🚀 COMO EXECUTAR AS MIGRAÇÕES

### **Opção 1: Script Automático (Windows)**

1. Abra o prompt de comando na pasta `scripts`:
   ```cmd
   cd "c:\Users\nicolas\Documents\Projeto Mind\blog-backend\scripts"
   ```

2. Execute o script:
   ```cmd
   run-migrations.bat
   ```

3. Digite sua senha do MySQL quando solicitado

---

### **Opção 2: Linha de Comando Manual**

```bash
# Entre na pasta scripts
cd "c:\Users\nicolas\Documents\Projeto Mind\blog-backend\scripts"

# Execute o script (substitua 'root' e 'blog_db' conforme necessário)
mysql -u root -p blog_db < migrations.sql
```

Quando solicitar, digite sua senha do MySQL.

---

### **Opção 3: MySQL Workbench**

1. Abra o **MySQL Workbench**
2. Conecte-se ao seu banco de dados
3. Vá em **File → Open SQL Script**
4. Selecione o arquivo:
   ```
   c:\Users\nicolas\Documents\Projeto Mind\blog-backend\scripts\migrations.sql
   ```
5. Clique no ícone de **raio (⚡)** para executar
6. Verifique a aba **Output** para confirmar sucesso

---

### **Opção 4: phpMyAdmin**

1. Acesse o **phpMyAdmin**
2. Selecione o banco `blog_db`
3. Clique na aba **SQL**
4. Abra o arquivo `migrations.sql` em um editor de texto
5. Copie todo o conteúdo
6. Cole na área de SQL do phpMyAdmin
7. Clique em **Executar**

---

## ✅ VERIFICAÇÃO

Após executar as migrações, verifique se tudo foi criado corretamente:

```sql
-- Verificar colunas da tabela users
DESCRIBE users;

-- Verificar colunas da tabela articles
DESCRIBE articles;

-- Verificar se a tabela comments foi criada
DESCRIBE comments;

-- Verificar índices
SHOW INDEX FROM articles;
SHOW INDEX FROM comments;
```

Você deve ver:
- ✅ `users` com colunas `avatar` e `bio`
- ✅ `articles` com colunas `resumo`, `categoria`, `tags`, `views`, `likes`
- ✅ Tabela `comments` criada com todas as colunas
- ✅ Índices criados

---

## 🔧 SCRIPT SQL COMPLETO

O script em `migrations.sql` faz o seguinte:

1. **Verifica se as colunas já existem** antes de adicionar (evita erros)
2. **Adiciona as novas colunas** nas tabelas existentes
3. **Cria a tabela comments** se não existir
4. **Cria índices** para melhorar performance
5. **Mostra a estrutura final** das tabelas

**O script é seguro para executar múltiplas vezes!**

---

## ⚠️ IMPORTANTE

- ✅ Faça **backup** do seu banco antes de executar
- ✅ Certifique-se que o banco `blog_db` existe
- ✅ Certifique-se que as tabelas `users` e `articles` já existem
- ✅ O script **não apaga dados existentes**
- ✅ O script **só adiciona** o que está faltando

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### Erro: "Table 'blog_db.users' doesn't exist"
**Solução:** Execute primeiro o `createDatabase.ts` para criar as tabelas base
```bash
npm run ts-node scripts/createDatabase.ts
```

### Erro: "Access denied"
**Solução:** Verifique usuário e senha do MySQL

### Erro: "Duplicate column name"
**Solução:** A coluna já existe, tudo bem! O script pula automaticamente

---

## 📞 APÓS EXECUTAR

1. ✅ Reinicie o servidor backend:
   ```bash
   npm run dev
   ```

2. ✅ Teste as novas rotas:
   - `GET /api/auth/me`
   - `GET /api/articles?page=1&limit=10`
   - `POST /api/articles/:id/comments`
   - `PUT /api/users/profile`
   - `GET /api/users/stats`

3. ✅ Verifique os logs do servidor para confirmar que não há erros

---

**Pronto! Seu banco está atualizado! 🎉**
