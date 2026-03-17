import connection from '../database/database';
import { Article, ArticleWithAuthor, CreateArticleData, UpdateArticleData, PaginationParams, PaginationResult } from '../types';

export class ArticleRepository {
  public async create(articleData: CreateArticleData, authorId: number): Promise<number> {
    try {
      const tagsJson = articleData.tags ? JSON.stringify(articleData.tags) : null;

      const result = await connection.query<{ id: number }>(
        `INSERT INTO articles 
          (titulo, conteudo, resumo, categoria, tags, id_autor, imagem_banner, views, likes) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0)
          RETURNING id`,
        [
          articleData.titulo,
          articleData.conteudo,
          articleData.resumo || null,
          articleData.categoria,
          tagsJson,
          authorId,
          articleData.imagem_banner || null,
        ]
      );

      return result.rows[0].id;
    } catch (error) {
      throw new Error(`Erro ao criar artigo: ${error}`);
    }
  }

  public async findById(id: number): Promise<Article | null> {
    try {
      const result = await connection.query<Article>('SELECT * FROM articles WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar artigo por ID: ${error}`);
    }
  }

  public async findByIdWithAuthor(id: number): Promise<ArticleWithAuthor | null> {
    try {
      const result = await connection.query<ArticleWithAuthor>(
        `SELECT 
          a.*,
          u.nome as autor_nome,
          u.email as autor_email,
          u.avatar as autor_avatar,
          u.bio as autor_bio,
          (SELECT COUNT(*) FROM comments WHERE id_article = a.id) as "commentsCount"
        FROM articles a
        INNER JOIN users u ON a.id_autor = u.id
        WHERE a.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar artigo com autor: ${error}`);
    }
  }

  public async findAll(): Promise<Article[]> {
    try {
      const result = await connection.query<Article>('SELECT * FROM articles ORDER BY data_publicacao DESC');

      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar artigos: ${error}`);
    }
  }

  public async findAllWithAuthors(): Promise<ArticleWithAuthor[]> {
    try {
      const result = await connection.query<ArticleWithAuthor>(
        `SELECT 
          a.*,
          u.nome as autor_nome,
          u.email as autor_email,
          u.avatar as autor_avatar,
          u.bio as autor_bio,
          (SELECT COUNT(*) FROM comments WHERE id_article = a.id) as "commentsCount"
        FROM articles a
        INNER JOIN users u ON a.id_autor = u.id
        ORDER BY a.data_publicacao DESC`
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar artigos com autores: ${error}`);
    }
  }

  public async findWithPagination(params: PaginationParams): Promise<PaginationResult<ArticleWithAuthor>> {
    try {
      const { page, limit, skip, categoria, search } = params;
      const offset = typeof skip === 'number' && Number.isFinite(skip) && skip >= 0
        ? skip
        : (page - 1) * limit;

      const whereConditions: string[] = [];
      const queryParams: unknown[] = [];

      if (categoria) {
        queryParams.push(categoria);
        whereConditions.push(`a.categoria = $${queryParams.length}`);
      }

      if (search) {
        const searchPattern = `%${search}%`;
        queryParams.push(searchPattern);
        const p1 = `$${queryParams.length}`;
        queryParams.push(searchPattern);
        const p2 = `$${queryParams.length}`;
        queryParams.push(searchPattern);
        const p3 = `$${queryParams.length}`;
        whereConditions.push(`(a.titulo LIKE ${p1} OR a.conteudo LIKE ${p2} OR a.resumo LIKE ${p3})`);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      const countResult = await connection.query<{ total: string }>(
        `SELECT COUNT(*) as total FROM articles a ${whereClause}`,
        queryParams
      );
      const totalItems = Number(countResult.rows[0]?.total ?? 0);

      const paginatedParams = [...queryParams, limit, offset];
      const limitPlaceholder = `$${queryParams.length + 1}`;
      const offsetPlaceholder = `$${queryParams.length + 2}`;

      const result = await connection.query<ArticleWithAuthor>(
        `SELECT 
          a.*,
          u.nome as autor_nome,
          u.email as autor_email,
          u.avatar as autor_avatar,
          u.bio as autor_bio,
          (SELECT COUNT(*) FROM comments WHERE id_article = a.id) as "commentsCount"
        FROM articles a
        INNER JOIN users u ON a.id_autor = u.id
        ${whereClause}
        ORDER BY a.data_publicacao DESC
        LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
        paginatedParams
      );

      const totalPages = Math.ceil(totalItems / limit) || 1;

      return {
        articles: result.rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
        },
      };
    } catch (error) {
      throw new Error(`Erro ao buscar artigos com paginação: ${error}`);
    }
  }

  public async findByAuthor(authorId: number): Promise<Article[]> {
    try {
      const result = await connection.query<Article>(
        'SELECT * FROM articles WHERE id_autor = $1 ORDER BY data_publicacao DESC',
        [authorId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar artigos por autor: ${error}`);
    }
  }

  public async update(id: number, articleData: UpdateArticleData): Promise<boolean> {
    try {
      const fields: string[] = [];
      const values: unknown[] = [];

      if (articleData.titulo) {
        values.push(articleData.titulo);
        fields.push(`titulo = $${values.length}`);
      }
      if (articleData.conteudo) {
        values.push(articleData.conteudo);
        fields.push(`conteudo = $${values.length}`);
      }
      if (articleData.resumo !== undefined) {
        values.push(articleData.resumo);
        fields.push(`resumo = $${values.length}`);
      }
      if (articleData.categoria) {
        values.push(articleData.categoria);
        fields.push(`categoria = $${values.length}`);
      }
      if (articleData.tags !== undefined) {
        const tagsJson = articleData.tags ? JSON.stringify(articleData.tags) : null;
        values.push(tagsJson);
        fields.push(`tags = $${values.length}`);
      }
      if (articleData.imagem_banner !== undefined) {
        values.push(articleData.imagem_banner);
        fields.push(`imagem_banner = $${values.length}`);
      }

      if (fields.length === 0) {
        return false;
      }

      fields.push('data_alteracao = NOW()');
      values.push(id);
      const idPlaceholder = `$${values.length}`;

      const result = await connection.query(
        `UPDATE articles SET ${fields.join(', ')} WHERE id = ${idPlaceholder}`,
        values
      );

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw new Error(`Erro ao atualizar artigo: ${error}`);
    }
  }

  public async incrementViews(id: number): Promise<boolean> {
    try {
      const result = await connection.query('UPDATE articles SET views = views + 1 WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw new Error(`Erro ao incrementar views: ${error}`);
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const result = await connection.query('DELETE FROM articles WHERE id = $1', [id]);

      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar artigo: ${error}`);
    }
  }

  public async isAuthor(articleId: number, userId: number): Promise<boolean> {
    try {
      const result = await connection.query(
        'SELECT id, id_autor FROM articles WHERE id = $1 AND id_autor = $2',
        [articleId, userId]
      );

      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Erro ao verificar autoria: ${error}`);
    }
  }
}
