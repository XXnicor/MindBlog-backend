import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connection from '../database/database';
import { Article, ArticleWithAuthor, CreateArticleData, UpdateArticleData, PaginationParams, PaginationResult } from '../types';
    export class ArticleRepository {

      public async create(articleData: CreateArticleData, authorId: number): Promise<number> {
        try {
          console.log('[ArticleRepository] Criando artigo no banco:', { articleData, authorId });
          
          const tagsJson = articleData.tags ? JSON.stringify(articleData.tags) : null;
          
          const [result] = await connection.query<ResultSetHeader>(
            `INSERT INTO articles 
            (titulo, conteudo, resumo, categoria, tags, id_autor, imagem_banner, views, likes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)`,
            [
              articleData.titulo,
              articleData.conteudo,
              articleData.resumo || null,
              articleData.categoria,
              tagsJson,
              authorId,
              articleData.imagem_banner || null
            ]
          );

          console.log('[ArticleRepository] Artigo inserido, insertId:', result.insertId);
          return result.insertId;
        } catch (error) {
          console.error('[ArticleRepository] Erro ao criar artigo:', error);
          throw new Error(`Erro ao criar artigo: ${error}`);
        }
      }

      public async findById(id: number): Promise<Article | null> {
        try {
          const [rows] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM articles WHERE id = ?',
            [id]
          );

          if (rows.length === 0) {
            return null;
          }

          return rows[0] as Article;
        } catch (error) {
          throw new Error(`Erro ao buscar artigo por ID: ${error}`);
        }
      }

      public async findByIdWithAuthor(id: number): Promise<ArticleWithAuthor | null> {
        try {
          const [rows] = await connection.query<RowDataPacket[]>(
            `SELECT 
              a.*,
              u.nome as autor_nome,
              u.email as autor_email,
              u.avatar as autor_avatar,
              u.bio as autor_bio,
              (SELECT COUNT(*) FROM comments WHERE id_article = a.id) as commentsCount
            FROM articles a
            INNER JOIN users u ON a.id_autor = u.id
            WHERE a.id = ?`,
            [id]
          );

          if (rows.length === 0) {
            return null;
          }

          return rows[0] as ArticleWithAuthor;
        } catch (error) {
          throw new Error(`Erro ao buscar artigo com autor: ${error}`);
        }
      }

      public async findAll(): Promise<Article[]> {
        try {
          const [rows] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM articles ORDER BY data_publicacao DESC'
          );

          return rows as Article[];
        } catch (error) {
          throw new Error(`Erro ao listar artigos: ${error}`);
        }
      }

      public async findAllWithAuthors(): Promise<ArticleWithAuthor[]> {
        try {
          const [rows] = await connection.query<RowDataPacket[]>(
            `SELECT 
              a.*,
              u.nome as autor_nome,
              u.email as autor_email,
              u.avatar as autor_avatar,
              u.bio as autor_bio,
              (SELECT COUNT(*) FROM comments WHERE id_article = a.id) as commentsCount
            FROM articles a
            INNER JOIN users u ON a.id_autor = u.id
            ORDER BY a.data_publicacao DESC`
          );

          return rows as ArticleWithAuthor[];
        } catch (error) {
          throw new Error(`Erro ao listar artigos com autores: ${error}`);
        }
      }

      public async findWithPagination(params: PaginationParams): Promise<PaginationResult<ArticleWithAuthor>> {
        try {
          console.log('[ArticleRepository] Buscando artigos com paginação:', params);
          
          const { page, limit, categoria, search } = params;
          const offset = (page - 1) * limit;

          let whereConditions: string[] = [];
          let queryParams: any[] = [];

          if (categoria) {
            whereConditions.push('a.categoria = ?');
            queryParams.push(categoria);
          }

          if (search) {
            whereConditions.push('(a.titulo LIKE ? OR a.conteudo LIKE ? OR a.resumo LIKE ?)');
            const searchPattern = `%${search}%`;
            queryParams.push(searchPattern, searchPattern, searchPattern);
          }

          const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

          console.log('[ArticleRepository] WHERE clause:', whereClause);
          console.log('[ArticleRepository] Query params:', queryParams);

          // Buscar total de itens
          const [countRows] = await connection.query<RowDataPacket[]>(
            `SELECT COUNT(*) as total FROM articles a ${whereClause}`,
            queryParams
          );
          const totalItems = countRows[0].total;
          
          console.log('[ArticleRepository] Total de artigos:', totalItems);

          // Buscar artigos com paginação
          const [rows] = await connection.query<RowDataPacket[]>(
            `SELECT 
              a.*,
              u.nome as autor_nome,
              u.email as autor_email,
              u.avatar as autor_avatar,
              u.bio as autor_bio,
              (SELECT COUNT(*) FROM comments WHERE id_article = a.id) as commentsCount
            FROM articles a
            INNER JOIN users u ON a.id_autor = u.id
            ${whereClause}
            ORDER BY a.data_publicacao DESC
            LIMIT ? OFFSET ?`,
            [...queryParams, limit, offset]
          );

          const articles = rows as ArticleWithAuthor[];
          const totalPages = Math.ceil(totalItems / limit) || 1; // Sempre retorna pelo menos 1 página
          
          console.log('[ArticleRepository] Artigos retornados:', articles.length);

          return {
            articles,
            pagination: {
              currentPage: page,
              totalPages,
              totalItems,
              itemsPerPage: limit
            }
          };
        } catch (error) {
          console.error('[ArticleRepository] Erro ao buscar artigos com paginação:', error);
          console.error('[ArticleRepository] Stack trace:', error instanceof Error ? error.stack : 'N/A');
          throw new Error(`Erro ao buscar artigos com paginação: ${error}`);
        }
      }

      public async findByAuthor(authorId: number): Promise<Article[]> {
        try {
          const [rows] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM articles WHERE id_autor = ? ORDER BY data_publicacao DESC',
            [authorId]
          );

          return rows as Article[];
        } catch (error) {
          throw new Error(`Erro ao buscar artigos por autor: ${error}`);
        }
      }

      public async update(id: number, articleData: UpdateArticleData): Promise<boolean> {
        try {
          const fields: string[] = [];
          const values: any[] = [];

          if (articleData.titulo) {
            fields.push('titulo = ?');
            values.push(articleData.titulo);
          }
          if (articleData.conteudo) {
            fields.push('conteudo = ?');
            values.push(articleData.conteudo);
          }
          if (articleData.resumo !== undefined) {
            fields.push('resumo = ?');
            values.push(articleData.resumo);
          }
          if (articleData.categoria) {
            fields.push('categoria = ?');
            values.push(articleData.categoria);
          }
          if (articleData.tags !== undefined) {
            fields.push('tags = ?');
            const tagsJson = articleData.tags ? JSON.stringify(articleData.tags) : null;
            values.push(tagsJson);
          }
          if (articleData.imagem_banner !== undefined) {
            fields.push('imagem_banner = ?');
            values.push(articleData.imagem_banner);
          }

          if (fields.length === 0) {
            return false;
          }

          fields.push('data_alteracao = NOW()');
          values.push(id);

          const [result] = await connection.query<ResultSetHeader>(
            `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`,
            values
          );

          return result.affectedRows > 0;
        } catch (error) {
          throw new Error(`Erro ao atualizar artigo: ${error}`);
        }
      }

      public async incrementViews(id: number): Promise<boolean> {
        try {
          const [result] = await connection.query<ResultSetHeader>(
            'UPDATE articles SET views = views + 1 WHERE id = ?',
            [id]
          );
          return result.affectedRows > 0;
        } catch (error) {
          throw new Error(`Erro ao incrementar views: ${error}`);
        }
      }

      public async delete(id: number): Promise<boolean> {
        try {
          const [result] = await connection.query<ResultSetHeader>(
            'DELETE FROM articles WHERE id = ?',
            [id]
          );

          return result.affectedRows > 0;
        } catch (error) {
          throw new Error(`Erro ao deletar artigo: ${error}`);
        }
      }

      public async isAuthor(articleId: number, userId: number): Promise<boolean> {
        try {
          console.log('[ArticleRepository] isAuthor - Verificando:', { articleId, userId });
          console.log('[ArticleRepository] isAuthor - Tipos:', { articleId: typeof articleId, userId: typeof userId });
          
          const [rows] = await connection.query<RowDataPacket[]>(
            'SELECT id, id_autor FROM articles WHERE id = ? AND id_autor = ?',
            [articleId, userId]
          );

          console.log('[ArticleRepository] isAuthor - Rows encontradas:', rows.length);
          if (rows.length > 0) {
            console.log('[ArticleRepository] isAuthor - Dados da row:', rows[0]);
          } else {
            // Buscar o artigo para ver qual é o autor real
            const [checkRows] = await connection.query<RowDataPacket[]>(
              'SELECT id, id_autor FROM articles WHERE id = ?',
              [articleId]
            );
            if (checkRows.length > 0) {
              console.log('[ArticleRepository] isAuthor - Autor real do artigo:', checkRows[0].id_autor, 'tipo:', typeof checkRows[0].id_autor);
              console.log('[ArticleRepository] isAuthor - User ID recebido:', userId, 'tipo:', typeof userId);
              console.log('[ArticleRepository] isAuthor - São iguais?', checkRows[0].id_autor == userId, '(==) |', checkRows[0].id_autor === userId, '(===)');
            }
          }

          return rows.length > 0;
        } catch (error) {
          throw new Error(`Erro ao verificar autoria: ${error}`);
        }
      }
    }
