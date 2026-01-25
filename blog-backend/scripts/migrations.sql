-- =====================================================
-- MIGRAÇÕES DO BANCO DE DADOS - Blog Backend
-- Data: 25/01/2026
-- =====================================================
-- 
-- INSTRUÇÕES:
-- 1. Conecte-se ao seu banco de dados MySQL
-- 2. Execute este script completo
-- 3. Verifique se não há erros
-- 
-- =====================================================

USE blog_db;

-- =====================================================
-- 1. ADICIONAR COLUNAS NA TABELA USERS
-- =====================================================

-- Verificar e adicionar coluna avatar
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'avatar';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN avatar VARCHAR(255) DEFAULT NULL AFTER email',
    'SELECT "Coluna avatar já existe" AS msg');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar e adicionar coluna bio
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'bio';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE users ADD COLUMN bio TEXT DEFAULT NULL AFTER avatar',
    'SELECT "Coluna bio já existe" AS msg');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 2. ADICIONAR COLUNAS NA TABELA ARTICLES
-- =====================================================

-- Verificar e adicionar coluna categoria
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'articles' 
AND COLUMN_NAME = 'categoria';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE articles ADD COLUMN categoria VARCHAR(50) DEFAULT "Dev" AFTER conteudo',
    'SELECT "Coluna categoria já existe" AS msg');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar e adicionar coluna resumo
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'articles' 
AND COLUMN_NAME = 'resumo';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE articles ADD COLUMN resumo VARCHAR(200) DEFAULT NULL AFTER titulo',
    'SELECT "Coluna resumo já existe" AS msg');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar e adicionar coluna tags
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'articles' 
AND COLUMN_NAME = 'tags';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE articles ADD COLUMN tags JSON DEFAULT NULL AFTER categoria',
    'SELECT "Coluna tags já existe" AS msg');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar e adicionar coluna views
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'articles' 
AND COLUMN_NAME = 'views';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE articles ADD COLUMN views INT DEFAULT 0 AFTER tags',
    'SELECT "Coluna views já existe" AS msg');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar e adicionar coluna likes
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'articles' 
AND COLUMN_NAME = 'likes';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE articles ADD COLUMN likes INT DEFAULT 0 AFTER views',
    'SELECT "Coluna likes já existe" AS msg');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 3. CRIAR TABELA DE COMENTÁRIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text TEXT NOT NULL,
  id_article INT NOT NULL,
  id_author INT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (id_article) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (id_author) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_article (id_article),
  INDEX idx_author (id_author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. CRIAR ÍNDICES PARA MELHORAR PERFORMANCE
-- =====================================================

-- Índice para categoria (se não existir)
SET @index_exists = 0;
SELECT COUNT(*) INTO @index_exists
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'articles'
AND INDEX_NAME = 'idx_articles_categoria';

SET @query = IF(@index_exists = 0,
    'CREATE INDEX idx_articles_categoria ON articles(categoria)',
    'SELECT "Índice idx_articles_categoria já existe" AS msg');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 5. VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'Migrações concluídas com sucesso!' AS status;

-- Verificar estrutura da tabela users
SELECT 'Estrutura da tabela users:' AS info;
DESCRIBE users;

-- Verificar estrutura da tabela articles
SELECT 'Estrutura da tabela articles:' AS info;
DESCRIBE articles;

-- Verificar estrutura da tabela comments
SELECT 'Estrutura da tabela comments:' AS info;
DESCRIBE comments;

-- =====================================================
-- FIM DAS MIGRAÇÕES
-- =====================================================
